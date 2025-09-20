export async function inspectPlaceholder(pdfBytes: Uint8Array) {
  // Convertimos a string para buscar las secciones
  const pdfText = new TextDecoder("latin1").decode(pdfBytes);

  // Regex para encontrar el ByteRange
  const byteRangeRegex = /\/ByteRange\s*\[([^\]]+)\]/;
  const byteRangeMatch = pdfText.match(byteRangeRegex);

  // Regex para encontrar Contents
  const contentsRegex = /\/Contents\s*<([A-F0-9]+)>/i;
  const contentsMatch = pdfText.match(contentsRegex);

  console.group("🔍 Placeholder inspection");
  if (byteRangeMatch) {
    console.log("✅ ByteRange encontrado:", byteRangeMatch[0]);
  } else {
    console.error("❌ No se encontró ByteRange");
  }

  if (contentsMatch) {
    const contents = contentsMatch[1];
    console.log(
      "✅ Contents encontrado (primeros 100 chars):",
      contents.slice(0, 100)
    );
    console.log("📏 Longitud total de Contents:", contents.length);
  } else {
    console.error("❌ No se encontró Contents");
  }
  console.groupEnd();
}
