import type { ValidateCertificationResponseDefinition } from "@/types/validate-certificate.definition";
import { useReadeFiles } from "./use-reade-files";
import { CertificateRepository } from "@/repositories/certificate.repository";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import forge from "node-forge";
import { Buffer } from "buffer";

const certificateRepository = new CertificateRepository();
export const usePdf = () => {
  const { getMd5StringFromBlob } = useReadeFiles();

  // const editPDF = async (
  //   file: File,
  //   signerPdf: ArrayBuffer,
  //   response: ValidateCertificationResponseDefinition["contenido"]
  // ) => {
  //   try {
  //     const arrayBuffer = await file.arrayBuffer();
  //     const pdfDoc = await PDFDocument.load(arrayBuffer);

  //     const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  //     const pages = pdfDoc.getPages();

  //     const textVertical = `${response.cnData} \n ${getMd5StringFromBlob(
  //       file
  //     )} \n ${formatDate("es-MX")}`;

  //     pages.forEach((page) => {
  //       const { height } = page.getSize();
  //       page.drawText(textVertical, {
  //         x: 8,
  //         y: height / 2,
  //         size: 5,
  //         font,
  //         lineHeight: 7,
  //         color: rgb(0.2, 0.2, 0.2),
  //         rotate: degrees(90),
  //       });
  //     });
  //     const reactPdfDoc = await PDFDocument.load(signerPdf);

  //     const newPages = await pdfDoc.copyPages(
  //       reactPdfDoc,
  //       reactPdfDoc.getPageIndices()
  //     );
  //     newPages.forEach((p) => pdfDoc.addPage(p));

  //     const mergedBytes = await pdfDoc.save();
  //     const mergedBlob = new Blob([mergedBytes], { type: "application/pdf" });
  //     const link = URL.createObjectURL(mergedBlob);
  //     window.open(link, "_blank");
  //     const res = await certificateRepository.documentRegister({
  //       ocspData: response.ocspData!,
  //       folioUnicoDocumento: response.folioUnicoDocumento,
  //       hashOriginal: getMd5StringFromBlob(file),
  //       hashMerged: getMd5StringFromBlob(
  //         await new Blob([file], { type: "application/pdf" }).arrayBuffer()
  //       ),
  //       hashSigned: getMd5StringFromBlob(await mergedBlob.arrayBuffer()),
  //     });

  //     console.log({ res });
  //   } catch (error) {
  //     toast.error(error as string);
  //   }
  // };

  const editPDF = async (
    file: File,
    signerPdf: ArrayBuffer,
    p12Buffer: ArrayBuffer,
    password: string,
    response: ValidateCertificationResponseDefinition["contenido"]
  ) => {
    try {
      // --- 1. Cargar PDF y agregar texto ---
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();

      const textVertical = `${response.cnData} \n ${await getMd5StringFromBlob(
        file
      )} \n ${new Date().toLocaleDateString("es-MX")}`;

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

      // --- 2. Merge de páginas adicionales ---
      const reactPdfDoc = await PDFDocument.load(signerPdf);
      const newPages = await pdfDoc.copyPages(
        reactPdfDoc,
        reactPdfDoc.getPageIndices()
      );
      newPages.forEach((p) => pdfDoc.addPage(p));

      // --- 3. Guardar PDF temporal como bytes ---
      const mergedBytes = await pdfDoc.save();
      const mergedBuffer = Buffer.from(mergedBytes);

      // --- 4. Firmar el PDF usando node-forge y p12 ---
      const p12Asn1 = forge.asn1.fromDer(
        forge.util.createBuffer(Buffer.from(p12Buffer))
      );
      const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);

      // Obtener llave privada y certificado
      const keyObj = p12.getBags({ bagType: forge.pki.oids.keyBag })[
        forge.pki.oids.keyBag
      ][0];
      const privateKey = keyObj.key;

      const certObj = p12.getBags({ bagType: forge.pki.oids.certBag })[
        forge.pki.oids.certBag
      ][0];
      const certificate = certObj.cert;

      // Crear la firma PKCS#7
      const p7 = forge.pkcs7.createSignedData();
      p7.content = forge.util.createBuffer(mergedBuffer);
      p7.addCertificate(certificate);
      p7.addSigner({
        key: privateKey,
        certificate: certificate,
        digestAlgorithm: forge.pki.oids.sha256,
      });
      p7.sign();

      const signedBytes = Buffer.from(
        forge.asn1.toDer(p7.toAsn1()).getBytes(),
        "binary"
      );

      // --- 5. Crear Blob del PDF firmado ---
      const signedBlob = new Blob([signedBytes], { type: "application/pdf" });

      // --- 6. Enviar registro al servidor ---
      const res = await certificateRepository.documentRegister({
        ocspData: response.ocspData,
        folioUnicoDocumento: response.folioUnicoDocumento,
        hashOriginal: await getMd5StringFromBlob(file),
        hashMerged: await getMd5StringFromBlob(mergedBuffer),
        hashSigned: await getMd5StringFromBlob(await signedBlob.arrayBuffer()),
      });

      console.log(res);
      // --- 7. Abrir PDF firmado ---
      const link = URL.createObjectURL(signedBlob);
      window.open(link, "_blank");

      return signedBlob;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    editPDF,
  };
};
