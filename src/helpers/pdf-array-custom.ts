import { CharCodes, PDFArray, PDFContext, PDFObject } from "pdf-lib";

export class PDFArrayCustom {
  private array: PDFArray;

  constructor(context: PDFContext) {
    this.array = PDFArray.withContext(context); // método estático de pdf-lib
  }

  static withContext(context: PDFContext) {
    return new PDFArrayCustom(context);
  }

  push(obj: PDFObject) {
    this.array.push(obj);
  }

  get(idx: number) {
    return this.array.get(idx);
  }

  size() {
    return this.array.size();
  }

  clone(context?: PDFContext) {
    const clone = PDFArrayCustom.withContext(context || this.array.context);
    for (let idx = 0, len = this.size(); idx < len; idx++) {
      clone.push(this.array.get(idx));
    }
    return clone;
  }

  toString(): string {
    let arrayString = "[";
    for (let idx = 0, len = this.size(); idx < len; idx++) {
      arrayString += this.get(idx).toString();
      if (idx < len - 1) arrayString += " ";
    }
    arrayString += "]";
    return arrayString;
  }

  sizeInBytes(): number {
    let size = 2;
    for (let idx = 0, len = this.size(); idx < len; idx++) {
      size += this.get(idx).sizeInBytes();
      if (idx < len - 1) size += 1;
    }
    return size;
  }

  copyBytesInto(buffer: Uint8Array, offset: number): number {
    const initialOffset = offset;
    buffer[offset++] = CharCodes.LeftSquareBracket;
    for (let idx = 0, len = this.size(); idx < len; idx++) {
      offset += this.get(idx).copyBytesInto(buffer, offset);
      if (idx < len - 1) buffer[offset++] = CharCodes.Space;
    }
    buffer[offset++] = CharCodes.RightSquareBracket;

    return offset - initialOffset;
  }
}
