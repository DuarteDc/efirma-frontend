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

  const pdfBlob = new Blob([pdfWithPlaceholder], { type: "application/pdf" });
  const pdfText = await pdfBlob.text();

  const byteRangeStrings = pdfText.match(
    /\/ByteRange\s*\[{1}\s*(?:(?:\d*|\/\*{10})\s+){3}(?:\d+|\/\*{10}){1}\s*]{1}/g
  );
  const byteRangePlaceholder = byteRangeStrings.find((s) =>
    s.includes(DEFAULT_BYTE_RANGE_PLACEHOLDER)
  );

  let pdfBytes = new Uint8Array(pdfWithPlaceholder);

  // ⚠️ latin1 también aquí
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

  // Reemplazar ByteRange en el PDF
  const beforeRange = pdfBytes.slice(0, byteRangePos);
  const afterRange = pdfBytes.slice(byteRangeEnd);
  pdfBytes = new Uint8Array([
    ...beforeRange,
    ...new TextEncoder().encode(actualByteRange),
    ...afterRange,
  ]);

  // Extraer la parte que se firma (excluyendo el placeholder)
  const part1 = pdfBytes.slice(0, byteRange[1]);
  const part2 = pdfBytes.slice(byteRange[2], byteRange[2] + byteRange[3]);
  const signedData = new Uint8Array([...part1, ...part2]);

  // 🔑 Generar la firma (async)
  const rawSignature = await getSignature(p12Buffer, password, signedData);
  const signatureHex = toHex(rawSignature);

  // Rellenar con ceros hasta el tamaño del placeholder
  if (signatureHex.length > placeholderLength) {
    throw new Error("La firma es más grande que el espacio reservado");
  }
  const paddedSignatureHex =
    signatureHex + "0".repeat(placeholderLength - signatureHex.length);

  // Insertar firma en el PDF
  const beforeSig = pdfBytes.slice(0, byteRange[1]);
  const afterSig = pdfBytes.slice(byteRange[1]);
  pdfBytes = new Uint8Array([
    ...beforeSig,
    ...new TextEncoder().encode(`<${paddedSignatureHex}>`),
    ...afterSig,
  ]);

  return new Blob([pdfBytes], { type: "application/pdf" });
};
