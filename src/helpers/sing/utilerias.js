export function readFile (file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.onload = function () {
      resolve(this.result)
    }
    reader.readAsArrayBuffer(file)
  })
}

function arrayBufferToByteString (arrayBuffer) {
  const uint8Array = new Uint8Array(arrayBuffer)
  let byteString = ''
  for (let i = 0; i < uint8Array.length; i++) {
    byteString += String.fromCharCode(uint8Array[i])
  }
  return byteString
}

function stringToArrayBuffer (str) {
  const buffer = new ArrayBuffer(str.length)
  const view = new Uint8Array(buffer, 'utf-8')
  for (let i = 0; i < str.length; i++) {
    view[i] = str.charCodeAt(i)
  }
  return buffer
}

function encontrarPosicion (texto, informacion, inicio) {
  var i = inicio

  for (i; i < texto.byteLength - informacion.byteLength; i++) {
    recorte = texto.slice(i, i + informacion.byteLength)
    if (
      arrayBufferToByteString(recorte) == arrayBufferToByteString(informacion)
    ) {
      return i
    }
  }
  return 0
}

function verificaTipoArchivo (documentoFile) {
  exito = false

  try {
    exito = documentoFile.type.toUpperCase() == 'APPLICATION/PDF'
  } catch (err) {
    console.log('El documento no es admitido')
  }
  return exito
}

function encontrar (outerArray, smallerArray) {
  for (var i = 0; i < outerArray.length - smallerArray.length + 1; ++i) {
    var found = true
    for (var j = 0; j < smallerArray.length; ++j) {
      if (outerArray[i + j] != smallerArray[j]) {
        found = false
        break
      }
    }
    if (found) return i
  }
  return -1
}

String.prototype.bin2hex = function () {
  var i = 0,
    l = this.length,
    chr,
    hex = ''
  for (i; i < l; ++i) {
    chr = this.charCodeAt(i).toString(16)
    hex += chr.length < 2 ? '0' + chr : chr
  }
  return hex
}

function loadImage (logo_url, callback) {
  var img = new Image()
  img.src = logo_url
  img.onload = function () {
    callback(img)
  }
}

const sliceLastChar = (pdf, character) => {
  const lastChar = pdf.slice(-1)
  const tochar = lastChar.text()
  if (tochar === character) {
    return pdf.slice(0, pdf.length - 1)
  }
  return pdf
}

function buf2hex (arrBuffer) {
  return [...new Uint8Array(arrBuffer)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('')
}

function base64ToArrayBuffer (base64) {
  var binaryString = atob(base64)
  var bytes = new Uint8Array(binaryString.length)
  for (var i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

function arrayBufferToBase64 (buffer) {
  var binary = ''
  var bytes = new Uint8Array(buffer)
  var len = bytes.byteLength
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

export function unit8ToBuffer (unit8) {
  var Buffer = window.Buffer
  let buf = Buffer.alloc(unit8.byteLength)
  const view = new Uint8Array(unit8)

  for (let i = 0; i < buf.length; ++i) {
    buf[i] = view[i]
  }
  return buf
}

function getMd5StringFromAB (dataInput) {
  data = arrayBufferToBase64(dataInput)
  md = forge.md.md5.create()
  md.update(data)
  return md.digest().toHex()
}
