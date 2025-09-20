import forge from "node-forge";

function arrayBufferToBinaryString(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return binary;
}

export const getSignature = (
  p12Buffer: ArrayBuffer,
  password: string,
  documento: ArrayBuffer,
  timestamp: Date = new Date()
): Uint8Array => {
  const p12Der = forge.util.createBuffer(
    arrayBufferToBinaryString(p12Buffer),
    "raw"
  );
  const p12Asn1 = forge.asn1.fromDer(p12Der);
  const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);

  const certBags = p12.getBags({ bagType: forge.pki.oids.certBag })[
    forge.pki.oids.certBag
  ];
  const keyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })[
    forge.pki.oids.pkcs8ShroudedKeyBag
  ]!;

  const privateKey = keyBags[0].key;

  const p7 = forge.pkcs7.createSignedData();
  p7.content = forge.util.createBuffer(
    arrayBufferToBinaryString(documento),
    "raw"
  );

  let certificate;
  for (const bag of certBags!) {
    const { publicKey } = bag.cert!;
    p7.addCertificate(bag.cert!);

    // Encontrar el certificado que corresponde a la llave privada
    if (
      privateKey!.n.compareTo(publicKey?.n) === 0 &&
      privateKey!.e.compareTo(publicKey?.e) === 0
    ) {
      certificate = bag.cert;
    }
  }

  if (!certificate) {
    throw new Error(
      "No se encontró un certificado correspondiente a la privateKey"
    );
  }

  p7.addSigner({
    key: privateKey!,
    certificate,
    digestAlgorithm: forge.pki.oids.sha256,
    authenticatedAttributes: [
      { type: forge.pki.oids.contentType, value: forge.pki.oids.data },
      { type: forge.pki.oids.signingTime, value: timestamp.toString() },
      { type: forge.pki.oids.messageDigest },
    ],
  });

  p7.sign({ detached: true });

  // Convertir resultado DER (string binario) → Uint8Array
  const derBytes = forge.asn1.toDer(p7.toAsn1()).getBytes();
  const result = new Uint8Array(derBytes.length);
  for (let i = 0; i < derBytes.length; i++) {
    result[i] = derBytes.charCodeAt(i);
  }

  return result;
};
