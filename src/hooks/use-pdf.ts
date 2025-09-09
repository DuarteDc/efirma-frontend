import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import QRCode from "qrcode";
export const usePdf = () => {
  const editPDF = async (file: File) => {
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

    // ---- (2) Agregar nueva hoja al final con tabla + QR ----
    const newPage = pdfDoc.addPage([595, 842]); // tamaño A4
    const { width, height } = newPage.getSize();

    // Título
    newPage.drawText("HOJA DE FIRMANTES", {
      x: width / 2 - 80,
      y: height - 60,
      size: 18,
      font,
      color: rgb(0, 0, 0),
    });

    // ---- Tabla ----
    const startX = 50;
    const startY = height - 120;
    const cellHeight = 40;
    const cellWidths = [120, 150, 120, 120];

    const headers = ["Firmante", "Nombre", "Validez", "Revocación"];
    const rows = [
      ["Firma #Serie", "CINDY GONZALEZ PIÑA", "Vigente", "No Revocado"],
      ["Fecha", "30/04/24 20:49:08", "Status OK", "Válida"],
      ["Algoritmo", "RSA - SHA256", "", ""],
    ];

    headers.forEach((h, i) => {
      const x = startX + cellWidths.slice(0, i).reduce((a, b) => a + b, 0);
      const y = startY;
      newPage.drawRectangle({
        x,
        y,
        width: cellWidths[i],
        height: cellHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });
      newPage.drawText(h, {
        x: x + 5,
        y: y + 15,
        size: 10,
        font,
      });
    });

    // Filas
    rows.forEach((row, rowIndex) => {
      row.forEach((cell, i) => {
        const x = startX + cellWidths.slice(0, i).reduce((a, b) => a + b, 0);
        const y = startY - (rowIndex + 1) * cellHeight;
        newPage.drawRectangle({
          x,
          y,
          width: cellWidths[i],
          height: cellHeight,
          borderColor: rgb(0, 0, 0),
          borderWidth: 1,
        });
        newPage.drawText(cell, {
          x: x + 5,
          y: y + 15,
          size: 10,
          font,
        });
      });
    });

    // ---- Texto extra debajo ----
    newPage.drawText(
      "Archivo firmado por: CINDY GONZALEZ PIÑA\nSerie: 50.4A.45.44...\nFecha de firma: 30/04/24 20:49:08\nCertificado vigente: 14/04/25",
      {
        x: 50,
        y: 200,
        size: 10,
        font,
      }
    );

    // ---- QR ----
    const qrData = await QRCode.toDataURL("https://ejemplo.com/validar");
    const qrImage = await pdfDoc.embedPng(qrData);
    const qrDims = qrImage.scale(0.5);
    newPage.drawImage(qrImage, {
      x: width - 200,
      y: 80,
      width: qrDims.width,
      height: qrDims.height,
    });

    // ---- Descargar PDF ----
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "documento-editado.pdf";
    link.click();
  };
  return {
    editPDF,
  };
};
