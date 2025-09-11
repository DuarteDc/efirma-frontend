import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";

export const usePdf = () => {
  const editPDF = async (file: File, signerPdf: ArrayBuffer) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // ---- (1) Agregar texto lateral en todas las páginas existentes ----
    const pages = pdfDoc.getPages();
    pages.forEach((page) => {
      const { height } = page.getSize();
      page.drawText("Documento interno", {
        x: 15,
        y: height / 2,
        size: 12,
        font,
        color: rgb(0.2, 0.2, 0.2),
        rotate: degrees(90), // vertical
      });
    });
    const reactPdfDoc = await PDFDocument.load(signerPdf);

    // Copiar las páginas de react-pdf dentro del PDF original
    const newPages = await pdfDoc.copyPages(
      reactPdfDoc,
      reactPdfDoc.getPageIndices()
    );
    newPages.forEach((p) => pdfDoc.addPage(p));

    // ---- (C) Guardar resultado ----
    const mergedBytes = await pdfDoc.save();
    const mergedBlob = new Blob([mergedBytes], { type: "application/pdf" });
    const link = URL.createObjectURL(mergedBlob);
    window.open(link, "_blank");
  };
  return {
    editPDF,
  };
};
