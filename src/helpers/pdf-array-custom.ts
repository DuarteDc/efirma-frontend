import { PDFArray, PDFContext, PDFObject } from "pdf-lib";

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
    const clone = PDFArrayCustom.withContext(context ?? this.array.context);
    for (let idx = 0; idx < this.array.size(); idx++) {
      clone.push(this.array.get(idx));
    }
    return clone;
  }

  toString(): string {
    return this.array.toString();
  }

  sizeInBytes(): number {
    return this.array.sizeInBytes();
  }

  copyBytesInto(buffer: Uint8Array, offset: number): number {
    return this.array.copyBytesInto(buffer, offset);
  }
}
