export interface ValidateCertificateDefinitionDto {
  cert: string;
}

export interface ValidateCertificationResponseDefinition {
  readonly error: boolean;
  readonly errores: string[];
  readonly datoObtenido: string;
  readonly contenido: ValidateCertification;
}

interface ValidateCertification {
  readonly serialNumber: string;
  readonly rfc: string;
  readonly email: string;
  readonly cData: null;
  readonly oData: string;
  readonly cnData: string;
  readonly timestamp: number;
  readonly numEmpleadoSSPC: string;
  readonly puestoSSPC: string;
  readonly fechaInicial: string;
  readonly fechaFinal: string;
  readonly vigente: boolean;
  readonly esFiel: boolean;
  readonly validacionRuta: boolean;
  readonly certAc: string;
  readonly certArc: string;
  readonly datosParticularesTramite: string;
  readonly datosDependenciaFirmante: string;
  readonly folioUnicoDocumento: number;
  readonly ocspData: null;
}
