import {
  PDFDocument,
  PDFName,
  PDFNumber,
  PDFHexString,
  PDFString,
} from "pdf-lib";

type PDFPlaceholderInput = ArrayBuffer | Uint8Array;

export async function pdfAddPlaceholder(
  pdfMerged: PDFPlaceholderInput
): Promise<Uint8Array> {
  const pdfMergedLoaded = await PDFDocument.load(pdfMerged);

  // Placeholder para ByteRange
  const DEFAULT_BYTE_RANGE_PLACEHOLDER = "**********";
  const SIGNATURE_LENGTH = 14000;

  const ByteRange: any = pdfMergedLoaded.context.obj([
    PDFNumber.of(0),
    PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER),
    PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER),
    PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER),
  ]);

  // Diccionario de la firma
  const signatureDict = pdfMergedLoaded.context.obj({
    Type: "Sig",
    Filter: "Adobe.PPKLite",
    SubFilter: "adbe.pkcs7.detached",
    ByteRange,
    Contents: PDFHexString.of("A".repeat(SIGNATURE_LENGTH)),
    Reason: PDFString.of("Document Signature"),
    M: PDFString.fromDate(new Date()),
  });

  const signatureDictRef = pdfMergedLoaded.context.register(signatureDict);

  // Widget de la firma
  const pages = pdfMergedLoaded.getPages();
  const widgetDict = pdfMergedLoaded.context.obj({
    Type: "Annot",
    Subtype: "Widget",
    FT: "Sig",
    Rect: [0, 0, 0, 0],
    V: signatureDictRef,
    T: PDFString.of("Signature1"),
    F: 4,
    P: pages[0].ref,
  });

  const widgetDictRef = pdfMergedLoaded.context.register(widgetDict);

  pages[0].node.set(
    PDFName.of("Annots"),
    pdfMergedLoaded.context.obj([widgetDictRef])
  );

  // Configurar AcroForm
  pdfMergedLoaded.catalog.set(
    PDFName.of("AcroForm"),
    pdfMergedLoaded.context.obj({
      SigFlags: 3,
      Fields: [widgetDictRef],
    })
  );

  // Guardar PDF
  const pdfBytes = await pdfMergedLoaded.save({ useObjectStreams: false });
  return pdfBytes; // Uint8Array
}
