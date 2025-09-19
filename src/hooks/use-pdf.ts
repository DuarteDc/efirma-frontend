import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import type { ValidateCertificationResponseDefinition } from "../types/validate-certificate.definition";
import { useReadeFiles } from "./use-reade-files";
import { formatDate } from "../utils/format-date";
import { pdfAddPlaceholder } from "@/helpers/add-placeholder";
import { getP12Cert } from "@/helpers/get-p12-cert";
import { signFile } from "@/helpers/sign-file";

export const usePdf = () => {
  const { getMd5StringFromBlob } = useReadeFiles();

  const editPDF = async (
    file: File,
    signerPdf: ArrayBuffer,
    cert: File,
    key: File,
    password: string,
    response: ValidateCertificationResponseDefinition["contenido"]
  ) => {
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
    // const mergedBlob = new Blob([mergedBytes], { type: "application/pdf" });

    const pdfWithPlaceholder = await pdfAddPlaceholder(mergedBytes, response);
    const p12Buffer = await getP12Cert(cert, key, password, response);

    const pdf = await signFile(pdfWithPlaceholder, password, p12Buffer);

    const url = window.URL.createObjectURL(pdf);
    window.open(url);
  };
  return {
    editPDF,
  };
};
