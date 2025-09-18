type ReadFileOptions = {
  as?: "arrayBuffer" | "base64";
};

export const readFile = (
  file: File,
  options: ReadFileOptions = { as: "arrayBuffer" }
) => {
  return new Promise<string | ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (options.as === "base64") {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      } else {
        resolve(reader.result as ArrayBuffer);
      }
    };

    reader.onerror = () => reject(reader.error);

    if (options.as === "base64") {
      reader.readAsDataURL(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
};
