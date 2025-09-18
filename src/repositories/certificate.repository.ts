import type {
  DocumentRegisterDefinitionDto,
  ValidateCertificateDefinitionDto,
  ValidateCertificationResponseDefinition,
} from "../types/validate-certificate.definition";
import { Http } from "../libs/http/http";
import { signApiInstance } from "@/libs/http/sign.conf";
import { toast } from "sonner";

export class CertificateRepository extends Http {
  constructor() {
    super(signApiInstance);
  }

  async validateCertificate(
    validateCertificate: ValidateCertificateDefinitionDto
  ) {
    try {
      const { contenido } =
        await this.post<ValidateCertificationResponseDefinition>(
          "/validate/certificate",
          validateCertificate
        );
      return contenido;
    } catch {
      toast.error("El certificado no es valido");
    }
  }

  async signDocument(validateCertificate: ValidateCertificateDefinitionDto) {
    try {
      const { contenido } =
        await this.post<ValidateCertificationResponseDefinition>(
          "/validate/certificateOCSP",
          validateCertificate
        );
      return contenido;
    } catch {
      toast.error("El certificado no es valido");
    }
  }

  async documentRegister(documentRegister: DocumentRegisterDefinitionDto) {
    try {
      const { contenido } =
        await this.post<ValidateCertificationResponseDefinition>(
          "/validate/documentRegister",
          documentRegister
        );
      return contenido;
    } catch {
      toast.error("El certificado no es valido");
    }
  }
}
