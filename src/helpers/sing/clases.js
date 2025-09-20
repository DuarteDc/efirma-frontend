export class PDFArrayCustom extends window.PDFLib.PDFArray {
  static withContext (context) {
    return new PDFArrayCustom(context)
  }

  clone (context) {
    const clone = PDFArrayCustom.withContext(context || this.context)
    for (let idx = 0, len = this.size(); idx < len; idx++) {
      clone.push(this.array[idx])
    }
    return clone
  }

  toString () {
    let arrayString = '['
    for (let idx = 0, len = this.size(); idx < len; idx++) {
      arrayString += this.get(idx).toString()
      if (idx < len - 1) arrayString += ' '
    }
    arrayString += ']'
    return arrayString
  }

  sizeInBytes () {
    let size = 2
    for (let idx = 0, len = this.size(); idx < len; idx++) {
      size += this.get(idx).sizeInBytes()
      if (idx < len - 1) size += 1
    }
    return size
  }

  copyBytesInto (buffer, offset) {
    const initialOffset = offset
    buffer[offset++] = window.PDFLib.CharCodes.LeftSquareBracket
    for (let idx = 0, len = this.size(); idx < len; idx++) {
      offset += this.get(idx).copyBytesInto(buffer, offset)
      if (idx < len - 1) buffer[offset++] = window.PDFLib.CharCodes.Space
    }
    buffer[offset++] = window.PDFLib.CharCodes.RightSquareBracket

    return offset - initialOffset
  }
}
