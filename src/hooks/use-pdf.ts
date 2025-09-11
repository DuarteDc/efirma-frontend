import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import type { ValidateCertificationResponseDefinition } from "../types/validate-certificate.definition";
import { useReadeFiles } from "./use-reade-files";
import { formatDate } from "../utils/format-date";

export const usePdf = () => {
  const { getMd5StringFromBlob } = useReadeFiles();

  const editPDF = async (
    file: File,
    signerPdf: ArrayBuffer,
    response: ValidateCertificationResponseDefinition["contenido"]
  ) => {
    console.log({ response });
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();

    const textVertical = `${response.cnData} \n ${getMd5StringFromBlob(
      file
    )} \n ${formatDate("es-MX")}`;

    pages.forEach((page) => {
      const { height } = page.getSize();
      page.drawText(textVertical, {
        x: 8,
        y: height / 2,
        size: 5,
        font,
        lineHeight: 7,
        color: rgb(0.2, 0.2, 0.2),
        rotate: degrees(90),
      });
    });
    const reactPdfDoc = await PDFDocument.load(signerPdf);

    const newPages = await pdfDoc.copyPages(
      reactPdfDoc,
      reactPdfDoc.getPageIndices()
    );
    newPages.forEach((p) => pdfDoc.addPage(p));

    const mergedBytes = await pdfDoc.save();
    const mergedBlob = new Blob([mergedBytes], { type: "application/pdf" });
    const link = URL.createObjectURL(mergedBlob);
    window.open(link, "_blank");
  };
  return {
    editPDF,
  };
};
