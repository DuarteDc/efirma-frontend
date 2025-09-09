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

  return {
    readAsBuffer,
    parseCertificate,
  };
};
