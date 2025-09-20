import { PDFArrayCustom } from './clases'
import { unit8ToBuffer } from './utilerias.js'

function abrirPKconPassword (key, password) {
  exito = false

  const privateKey = getPrivateKey(key, password)
  if (privateKey != null) {
    exito = true
    console.log('Procesamiento de llave es correcto')
    return exito
  } else {
    exito = false
    console.log('Procesamiento de llave es incorrecto')
    return exito
  }
}

function certificadoVigente () {
  exito = false

  try {
    if (response.vigente) {
      exito = true
      console.log('El certificado es vigente')
      return exito
    } else {
      exito = false
      console.log('El certificado NO es vigente')
      return exito
    }
  } catch (err) {
    exito = false
    console.log('Error al procesar la vigencia del certificado')
    return exito
  }
}

function keyMatchCert (cert, key, password) {
  exito = false

  const privateKey = getPrivateKey(key, password)
  if (privateKey != null) {
    exito = true
    const certificadoPem = getCert(cert)
    if (certificadoPem != null) {
      try {
        const certificado = forge.pki.certificateFromPem(certificadoPem)
        const publicKey = certificado.publicKey
        let testData = forge.random.getBytesSync(8)
        let crypt = publicKey.encrypt(testData)
        exito = testData == privateKey.decrypt(crypt)
      } catch (err) {
        exito = false
        console.log('Llave y certificado no coinciden')
        return exito
      }
    } else {
      exito = false
      console.log('Procesamiento de llave es incorrecto')
      return exito
    }

    console.log('Llave y certificado coinciden')
    return exito
  } else {
    exito = false
    console.log('Llave y certificado no coinciden')
    return exito
  }
}

function verificaOCSP () {
  return new Promise(resolve => {
    let input = document.getElementById('crtInput')
    let certFile = input.files[0]

    readFile(certFile).then(readerResult => {
      let certBase64 = btoa(
        String.fromCharCode.apply(null, new Uint8Array(readerResult))
      )
      console.log('Certificado leído')
      let certJson = '{"cert": "' + certBase64 + '"}'

      fetch('https://efirma.uaf.sspc.gob.mx/ws/validate/certificateOCSP', {
        method: 'POST',
        body: certJson
      })
        .then(resultJson => resultJson.json())
        .then(resultObject => {
          console.log('Validacion Cert ejecutada')
          if (!resultObject.error) {
            document.getElementById('RFC').value = resultObject.contenido.rfc
            resolve(resultObject)
            console.log('Validacion Cert exitosa')
          } else {
            let texto = ''
            for (errorData of resultObject.errores) {
              texto =
                texto + errorData.codigoError + ' ' + errorData.descError + '\n'
            }
            alert(texto)
            input.value = ''
            document.getElementById('RFC').value = ''
            console.log('Validacion Cert fallida')
          }
        })
    })
  })
}

function getPrivateKey (key, password) {
  try {
    let keyHex = btoa(String.fromCharCode.apply(null, new Uint8Array(key)))

    let keyPem = '-----BEGIN ENCRYPTED PRIVATE KEY-----\n'

    while (keyHex.length > 0) {
      let temp = ''
      let contador = 63
      if (keyHex.length > contador) {
        for (let i = 0; i < 64; i++) {
          temp = temp + keyHex[i]
        }
      } else {
        temp = keyHex
      }
      keyPem = keyPem + temp + '\n'
      keyHex = keyHex.replace(temp, '')
    }
    keyPem = keyPem + '-----END ENCRYPTED PRIVATE KEY-----'
    return forge.pki.decryptRsaPrivateKey(keyPem, password)
  } catch (err) {
    console.log(err)
    return null
  }
}

export function getCert (cert) {
  try {
    let certHex = btoa(String.fromCharCode.apply(null, new Uint8Array(cert)))
    let certPem = '-----BEGIN CERTIFICATE-----\n'

    while (certHex.length > 0) {
      let temp = ''
      let contador = 63
      if (certHex.length > contador) {
        for (let i = 0; i < 64; i++) {
          temp = temp + certHex[i]
        }
      } else {
        temp = certHex
      }
      certPem = certPem + temp + '\n'
      certHex = certHex.replace(temp, '')
    }
    certPem = certPem + '-----END CERTIFICATE-----'
    return certPem
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function getP12Cert (certificadoIn, llaveIn, passwordIn, response) {
  console.log(certificadoIn)
  console.log(llaveIn)

  const privateKey = await getPrivateKey(llaveIn, passwordIn)
  const certificadoPem = await getCert(certificadoIn)

  console.log({ privateKey })
  console.log({ certificadoPem })

  var caStore = forge.pki.createCaStore([
    atob(response.certArc),
    atob(response.certAc)
  ])
  console.log(caStore)
  caStore.addCertificate(certificadoPem)

  var p12Asn1 = forge.pkcs12.toPkcs12Asn1(
    privateKey,
    caStore.listAllCertificates(),
    passwordIn,
    { algorithm: '3des' }
  )

  var p12Der = forge.asn1.toDer(p12Asn1).getBytes()

  return Buffer.from(p12Der, 'binary')
}

export async function mergePdf (pdfFirma, pdfOriginal) {
  const PDFDocument = window.PDFLib.PDFDocument

  const original = await PDFDocument.load(pdfOriginal)
  const firma = await PDFDocument.load(await pdfFirma.arrayBuffer())

  const copied = await original.copyPages(firma, [0])
  original.addPage(copied[0])

  const pdfMerged = await original.save({ useObjectStreams: false })

  return pdfMerged
}

export async function pdfAddPlaceholder (pdfMerged, response) {
  const PDFDocument = window.PDFLib.PDFDocument

  const pdfMergedLoaded = await PDFDocument.load(pdfMerged)

  const ByteRange = new PDFArrayCustom(pdfMergedLoaded.context)
  console.log({ ByteRange })
  const DEFAULT_BYTE_RANGE_PLACEHOLDER = '**********'
  const SIGNATURE_LENGTH = 14000
  const pages = pdfMergedLoaded.getPages()

  ByteRange.push(PDFLib.PDFNumber.of(0))
  ByteRange.push(PDFLib.PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER))
  ByteRange.push(PDFLib.PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER))
  ByteRange.push(PDFLib.PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER))

  const signatureDict = pdfMergedLoaded.context.obj({
    Type: 'Sig',
    Filter: 'Adobe.PPKLite',
    SubFilter: 'adbe.pkcs7.detached',
    ByteRange,
    Contents: PDFLib.PDFHexString.of('A'.repeat(SIGNATURE_LENGTH)),
    Reason: PDFLib.PDFString.of('Document Signature'),
    M: PDFLib.PDFString.fromDate(new Date(response.timestamp))
  })

  const signatureDictRef = await pdfMergedLoaded.context.register(signatureDict)

  const widgetDict = pdfMergedLoaded.context.obj({
    Type: 'Annot',
    Subtype: 'Widget',
    FT: 'Sig',
    Rect: [0, 0, 0, 0], // Signature rect size
    V: signatureDictRef,
    T: PDFLib.PDFString.of('Signature1'),
    F: 4,
    P: pages[0].ref
  })

  const widgetDictRef = await pdfMergedLoaded.context.register(widgetDict)

  pages[0].node.set(
    PDFLib.PDFName.of('Annots'),
    pdfMergedLoaded.context.obj([widgetDictRef])
  )

  pdfMergedLoaded.catalog.set(
    PDFLib.PDFName.of('AcroForm'),
    pdfMergedLoaded.context.obj({
      SigFlags: 3,
      Fields: [widgetDictRef]
    })
  )

  pdfMergedLoaded.setTitle('')
  pdfMergedLoaded.setAuthor('')
  pdfMergedLoaded.setSubject('')
  pdfMergedLoaded.setKeywords([''])
  pdfMergedLoaded.setProducer('')
  pdfMergedLoaded.setCreator('')
  pdfMergedLoaded.setCreationDate(new Date(response.timestamp))
  pdfMergedLoaded.setModificationDate(new Date(response.timestamp))

  const pdfBytes = await pdfMergedLoaded.save({ useObjectStreams: false })

  return unit8ToBuffer(pdfBytes)
}

async function getSignature (p12Buffer, passwordIn, documentoIn, response) {
  const p12Cert = forge.util.createBuffer(p12Buffer.toString('binary'))

  const p12Asn1 = forge.asn1.fromDer(p12Cert)
  const p12 = forge.pkcs12.pkcs12FromAsn1(
    p12Asn1,
    { asn1StrictParsing: false },
    passwordIn
  )

  const certBags = p12.getBags({
    bagType: forge.pki.oids.certBag
  })[forge.pki.oids.certBag]
  const keyBags = p12.getBags({
    bagType: forge.pki.oids.pkcs8ShroudedKeyBag
  })[forge.pki.oids.pkcs8ShroudedKeyBag]

  const privateKey = keyBags[0].key

  const p7 = forge.pkcs7.createSignedData()
  p7.content = forge.util.createBuffer(documentoIn, 'binary')

  let certificate
  Object.keys(certBags).forEach(i => {
    const { publicKey } = certBags[i].cert

    p7.addCertificate(certBags[i].cert)

    // Try to find the certificate that matches the private key.
    if (
      privateKey.n.compareTo(publicKey.n) === 0 &&
      privateKey.e.compareTo(publicKey.e) === 0
    ) {
      certificate = certBags[i].cert
    }
  })

  p7.addSigner({
    key: privateKey,
    certificate,
    digestAlgorithm: forge.pki.oids.sha256,
    authenticatedAttributes: [
      {
        type: forge.pki.oids.contentType,
        value: forge.pki.oids.data
      },
      {
        type: forge.pki.oids.signingTime,
        value: new Date(response.timestamp)
      },
      {
        type: forge.pki.oids.messageDigest
      }
    ]
  })

  p7.sign({ detached: true })

  return Buffer.from(forge.asn1.toDer(p7.toAsn1()).getBytes(), 'binary')
}

export async function sign (pdf, passwordIn, p12Buffer, response) {
  const DEFAULT_BYTE_RANGE_PLACEHOLDER = '**********'

  let pdfBlob = new Blob([pdf], { type: 'application/pdf' })
  let pdfText = await pdfBlob.text()

  const byteRangeStrings = pdfText.match(
    /\/ByteRange\s*\[{1}\s*(?:(?:\d*|\/\*{10})\s+){3}(?:\d+|\/\*{10}){1}\s*]{1}/g
  )
  const byteRangePlaceholder = byteRangeStrings.find(s =>
    s.includes(DEFAULT_BYTE_RANGE_PLACEHOLDER)
  )
  //const byteRanges = byteRangeStrings.map(brs => brs.match(/[^[\s]*(?:\d|\/\*{10})/g));

  const byteRangePos = pdf.indexOf(byteRangePlaceholder)
  const byteRangeEnd = byteRangePos + byteRangePlaceholder.length
  const contentsTagPos = pdf.indexOf('/Contents ', byteRangeEnd)
  const placeholderPos = pdf.indexOf('<', contentsTagPos)
  const placeholderEnd = pdf.indexOf('>', placeholderPos)
  const placeholderLengthWithBrackets = placeholderEnd + 1 - placeholderPos
  const placeholderLength = placeholderLengthWithBrackets - 2
  const byteRange = [0, 0, 0, 0]
  byteRange[1] = placeholderPos
  byteRange[2] = byteRange[1] + placeholderLengthWithBrackets
  byteRange[3] = pdf.length - byteRange[2]
  let actualByteRange = `/ByteRange [${byteRange.join(' ')}]`
  actualByteRange += ' '.repeat(
    byteRangePlaceholder.length - actualByteRange.length
  )

  pdf = Buffer.concat([
    pdf.slice(0, byteRangePos),
    Buffer.from(actualByteRange),
    pdf.slice(byteRangeEnd)
  ])

  pdf = Buffer.concat([
    pdf.slice(0, byteRange[1]),
    pdf.slice(byteRange[2], byteRange[2] + byteRange[3])
  ])

  const raw = await getSignature(p12Buffer, passwordIn, pdf, response)

  let signature = Buffer.from(raw, 'binary').toString('hex')

  signature += Buffer.from(
    String.fromCharCode(0).repeat(placeholderLength / 2 - raw.length)
  ).toString('hex')

  pdf = Buffer.concat([
    pdf.slice(0, byteRange[1]),
    Buffer.from(`<${signature}>`),
    pdf.slice(byteRange[1])
  ])

  pdf = new Blob([pdf], { type: 'application/pdf' })

  return pdf
  requestBody = '{'
  requestBody = requestBody + '"ocspData": "' + response.ocspData + '",'
  requestBody =
    requestBody + '"folioUnicoDocumento": ' + response.folioUnicoDocumento + ','
  requestBody = requestBody + '"hashOriginal": "' + md5Documento + '",'
  requestBody =
    requestBody +
    '"hashMerged": "' +
    getMd5StringFromAB(await pdfBlob.arrayBuffer()) +
    '",'
  requestBody =
    requestBody +
    '"hashSigned": "' +
    getMd5StringFromAB(await pdf.arrayBuffer()) +
    '"}'

  fetch('https://efirma.uaf.sspc.gob.mx/ws/validate/documentRegister', {
    method: 'POST',
    body: requestBody
  })

  return pdf
}
