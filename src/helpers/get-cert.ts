export const getCert = async (certFile: File): Promise<string | null> => {
  try {
    const arrayBuffer = await certFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    let binary = "";
    const chunkSize = 0x8000;
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, i + chunkSize);
      binary += String.fromCharCode(...chunk);
    }
    const base64String = btoa(binary);

    const lines = [];
    for (let i = 0; i < base64String.length; i += 64) {
      lines.push(base64String.substr(i, 64));
    }

    const pem = `-----BEGIN CERTIFICATE-----\n${lines.join(
      "\n"
    )}\n-----END CERTIFICATE-----`;
    return pem;
  } catch (err) {
    console.error("Error convirtiendo certificado:", err);
    return null;
  }
};
