import forge from "node-forge";
import { Buffer } from "buffer";

import { getCert } from "./get-cert";
import { getPrivateKey } from "./get-private-key";
import type { ValidateCertificationResponseDefinition } from "@/types/validate-certificate.definition";

export const getP12Cert = async (
  cert: File,
  key: File,
  password: string,
  response: ValidateCertificationResponseDefinition["contenido"]
) => {
  const privateKey = await getPrivateKey(key, password);
  const certificadoPem = await getCert(cert);

  if (!certificadoPem) throw new Error("Error to read cert file");
  if (!privateKey) throw new Error("Error to read key file");

  const caStore = forge.pki.createCaStore([
    atob(response.certArc),
    atob(response.certAc),
  ]);
  caStore.addCertificate(certificadoPem as unknown as string);

  const p12Asn1 = forge.pkcs12.toPkcs12Asn1(
    privateKey,
    caStore.listAllCertificates(),
    password,
    { algorithm: "3des" }
  );

  const p12Der = forge.asn1.toDer(p12Asn1).getBytes();

  return Buffer.from(p12Der, "binary");
};
