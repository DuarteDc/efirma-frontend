import forge from "node-forge";
export const useReadeFiles = () => {
  const readAsBuffer = async (file: File) => {
    return await file.arrayBuffer();
  };

  const parseCertificate = (buffer: ArrayBuffer) => {
    const certBase64 = btoa(
      String.fromCharCode.apply(null, new Uint8Array(buffer))
    );
    return certBase64;
  };

  const arrayBufferToBase64 = (buffer: Buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };
  const getMd5StringFromBlob = (file: Buffer) => {
    const data = arrayBufferToBase64(file);
    const md = forge.md.md5.create();
    md.update(data);
    return md.digest().toHex();
  };

  const getCert = (cert: ArrayBuffer) => {
    try {
      let certHex = btoa(String.fromCharCode.apply(null, new Uint8Array(cert)));
      console.log({ certHex });
      let certPem = "-----BEGIN CERTIFICATE-----\n";

      while (certHex.length > 0) {
        let temp = "";
        const contador = 63;
        if (certHex.length > contador) {
          for (let i = 0; i < 64; i++) {
            temp = temp + certHex[i];
          }
        } else {
          temp = certHex;
        }
        certPem = certPem + temp + "\n";
        certHex = certHex.replace(temp, "");
      }
      certPem = certPem + "-----END CERTIFICATE-----";
      return certPem
        .replaceAll("-----BEGIN CERTIFICATE-----", "")
        .replaceAll("-----END CERTIFICATE-----", "")
        .replaceAll("\n", "")
        .replaceAll("\r", "");
    } catch {
      return null;
    }
  };
  return {
    readAsBuffer,
    getMd5StringFromBlob,
    getCert,
    parseCertificate,
  };
};
