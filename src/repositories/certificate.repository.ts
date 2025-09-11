import type {
  ValidateCertificateDefinitionDto,
  ValidateCertificationResponseDefinition,
} from "../types/validate-certificate.definition";
import { efirmaApiInstance } from "../libs/http/conf";
import { Http } from "../libs/http/http";
import { ErrorAlert } from "../components/ui/alets.ui";

export class CertificateRepository extends Http {
  constructor() {
    super(efirmaApiInstance);
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
      ErrorAlert({ title: "Error", message: "" });
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
      ErrorAlert({ title: "Error", message: "" });
    }
  }
}
