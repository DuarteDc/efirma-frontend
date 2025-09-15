export interface LoginDefinitionDto {
  rfc: string;
  password: string;
  certificate: File;
}

export interface LoginResponseDefinition {
  readonly user: User;
}

export interface User {
  readonly id: string;
  readonly rfc: string;
  readonly name: string;
  readonly lastNameFather: string;
  readonly lastNameMother: string;
  readonly status: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly accessToken: string;
  readonly refreshToken: string;
}
