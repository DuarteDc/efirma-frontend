import forge from "node-forge";

export const getPrivateKey = async (
  key: File | ArrayBuffer | Uint8Array,
  password: string
): Promise<forge.pki.rsa.PrivateKey | null> => {
  try {
    let uint8Array: Uint8Array;

    if (key instanceof File) {
      const arrayBuffer = await key.arrayBuffer();
      uint8Array = new Uint8Array(arrayBuffer);
    } else if (key instanceof ArrayBuffer) {
      uint8Array = new Uint8Array(key);
    } else {
      uint8Array = key;
    }

    let binary = "";
    const chunkSize = 0x8000; // 32KB
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, i + chunkSize);
      binary += String.fromCharCode(...chunk);
    }
    const base64String = btoa(binary);

    // Construir PEM
    const lines = [];
    for (let i = 0; i < base64String.length; i += 64) {
      lines.push(base64String.substr(i, 64));
    }
    const keyPem = `-----BEGIN ENCRYPTED PRIVATE KEY-----\n${lines.join(
      "\n"
    )}\n-----END ENCRYPTED PRIVATE KEY-----`;

    const privateKey = forge.pki.decryptRsaPrivateKey(keyPem, password);

    return privateKey || null;
  } catch (err) {
    console.error("Error desencriptando clave privada:", err);
    return null;
  }
};
