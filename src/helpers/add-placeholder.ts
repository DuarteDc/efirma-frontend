import {
  PDFDocument,
  PDFName,
  PDFNumber,
  PDFHexString,
  PDFString,
} from "pdf-lib";
import { unit8ToBuffer } from "./unit8ToBuffer";
import type { ValidateCertificationResponseDefinition } from "@/types/validate-certificate.definition";

type PDFPlaceholderInput = ArrayBuffer | Uint8Array;

export async function pdfAddPlaceholder(
  pdfMerged: PDFPlaceholderInput,
  response: ValidateCertificationResponseDefinition["contenido"]
): Promise<Uint8Array> {
  const SIGNATURE_LENGTH = 14000;
  const DEFAULT_BYTE_RANGE_PLACEHOLDER = "**********";

  const pdfDoc = await PDFDocument.load(pdfMerged);
  const ByteRange = pdfDoc.context.obj([
    PDFNumber.of(0),
    PDFNumber.of(0),
    PDFNumber.of(0),
    PDFNumber.of(0),
  ]);

  const signatureDict = pdfDoc.context.obj({
    Type: PDFName.of("Sig"),
    Filter: PDFName.of("Adobe.PPKLite"),
    SubFilter: PDFName.of("adbe.pkcs7.detached"),
    ByteRange,
    Contents: PDFHexString.of("A".repeat(SIGNATURE_LENGTH)),
    Reason: PDFString.of("Document Signature"),
    M: PDFString.fromDate(new Date(response.timestamp)),
  });

  const signatureDictRef = pdfDoc.context.register(signatureDict);

  const pages = pdfDoc.getPages();
  const widgetDict = pdfDoc.context.obj({
    Type: PDFName.of("Annot"),
    Subtype: PDFName.of("Widget"),
    FT: PDFName.of("Sig"),
    Rect: [0, 0, 0, 0],
    V: signatureDictRef,
    T: PDFString.of("Signature1"),
    F: PDFNumber.of(4),
    P: pages[0].ref,
  });

  const widgetDictRef = pdfDoc.context.register(widgetDict);

  pages[0].node.set(PDFName.of("Annots"), pdfDoc.context.obj([widgetDictRef]));

  pdfDoc.catalog.set(
    PDFName.of("AcroForm"),
    pdfDoc.context.obj({
      SigFlags: PDFNumber.of(3),
      Fields: [widgetDictRef],
    })
  );

  const rawPdfBytes = await pdfDoc.save({ useObjectStreams: false });
  let pdfText = new TextDecoder("latin1").decode(rawPdfBytes);

  // Reemplazar el ByteRange con placeholders
  pdfText = pdfText.replace(
    /\/ByteRange\s*\[\s*\d+\s+\d+\s+\d+\s+\d+\s*\]/,
    `/ByteRange [0 ${DEFAULT_BYTE_RANGE_PLACEHOLDER} ${DEFAULT_BYTE_RANGE_PLACEHOLDER} ${DEFAULT_BYTE_RANGE_PLACEHOLDER}]`
  );

  const finalBytes = new TextEncoder().encode(pdfText);
  return unit8ToBuffer(finalBytes);
}
