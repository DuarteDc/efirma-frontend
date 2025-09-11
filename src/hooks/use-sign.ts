import { useState } from "react";
import { CertificateRepository } from "../repositories/certificate.repository";
import type { ValidateCertificateDefinitionDto } from "../types/validate-certificate.definition";

const certificateRepository = new CertificateRepository();

export const useSign = () => {
  const [loading, setLoading] = useState(false);
  const toggleLoading = () => setLoading((prev) => !prev);

  const startValidateDocument = async (
    validateCertificateDefinitionDto: ValidateCertificateDefinitionDto
  ) => {
    toggleLoading();
    const certificate = await certificateRepository.validateCertificate(
      validateCertificateDefinitionDto
    );
    if (!certificate) return toggleLoading();
    toggleLoading();
    return certificate;
  };

  const startSignDocument = async (
    validateCertificateDefinitionDto: ValidateCertificateDefinitionDto
  ) => {
    toggleLoading();
    const certificate = await certificateRepository.signDocument(
      validateCertificateDefinitionDto
    );
    if (!certificate) return toggleLoading();
    toggleLoading();
    return certificate;
  };

  return {
    loading,
    startSignDocument,
    startValidateDocument,
  };
};
