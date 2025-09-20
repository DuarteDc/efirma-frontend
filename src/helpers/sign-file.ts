import { getSignature } from "./get-signature";

function toHex(uint8: Uint8Array): string {
  return Array.from(uint8)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const signFile = async (
  pdfWithPlaceholder: ArrayBuffer,
  password: string,
  p12Buffer: ArrayBuffer
): Promise<Blob> => {
  const DEFAULT_BYTE_RANGE_PLACEHOLDER = "**********";

  const pdfText = new TextDecoder("latin1").decode(pdfWithPlaceholder);
  const byteRangeRegex =
    /\/ByteRange\s*\[\s*(?:\d+|\*+)\s+(?:\d+|\*+)\s+(?:\d+|\*+)\s+(?:\d+|\*+)\s*\]/g;

  const byteRangeStrings = pdfText.match(byteRangeRegex);
  const byteRangePlaceholder = byteRangeStrings?.find((s) =>
    s.includes(DEFAULT_BYTE_RANGE_PLACEHOLDER)
  );
  if (!byteRangePlaceholder) throw new Error("ByteRange no encontrado");

  const pdfBytes = new Uint8Array(pdfWithPlaceholder);
  const pdfString = new TextDecoder("latin1").decode(pdfBytes);

  const byteRangePos = pdfString.indexOf(byteRangePlaceholder);
  const byteRangeEnd = byteRangePos + byteRangePlaceholder.length;
  const contentsTagPos = pdfString.indexOf("/Contents ", byteRangeEnd);
  const placeholderPos = pdfString.indexOf("<", contentsTagPos);
  const placeholderEnd = pdfString.indexOf(">", placeholderPos);
  const placeholderLengthWithBrackets = placeholderEnd + 1 - placeholderPos;
  const placeholderLength = placeholderLengthWithBrackets - 2;

  const byteRange = [0, 0, 0, 0];
  byteRange[1] = placeholderPos;
  byteRange[2] = byteRange[1] + placeholderLengthWithBrackets;
  byteRange[3] = pdfBytes.length - byteRange[2];

  let actualByteRange = `/ByteRange [${byteRange.join(" ")}]`;
  actualByteRange += " ".repeat(
    byteRangePlaceholder.length - actualByteRange.length
  );

  const beforeRange = pdfBytes.slice(0, byteRangePos);
  const afterRange = pdfBytes.slice(byteRangeEnd);
  const updatedPdf = new Uint8Array([
    ...beforeRange,
    ...new TextEncoder().encode(actualByteRange),
    ...afterRange,
  ]);

  const part1 = updatedPdf.slice(0, byteRange[1]);
  const part2 = updatedPdf.slice(byteRange[2], byteRange[2] + byteRange[3]);
  const signedData = new Uint8Array([...part1, ...part2]);

  const rawSignature = await getSignature(p12Buffer, password, signedData);
  let signatureHex = toHex(rawSignature);

  if (signatureHex.length > placeholderLength) {
    throw new Error("La firma es más grande que el espacio reservado");
  }

  signatureHex += "0".repeat(placeholderLength - signatureHex.length);
  const signatureString = `<${signatureHex}>`;
  const signatureBytes = new TextEncoder().encode(signatureString);

  const beforeSig = updatedPdf.slice(0, placeholderPos);
  const afterSig = updatedPdf.slice(placeholderEnd + 1);
  const finalPdf = new Uint8Array([
    ...beforeSig,
    ...signatureBytes,
    ...afterSig,
  ]);

  return new Blob([finalPdf], { type: "application/pdf" });
};
