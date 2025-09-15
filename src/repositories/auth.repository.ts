import { efirmaApiInstance } from "@/libs/http/conf";
import { Http } from "@/libs/http/http";
import { toast } from "sonner";
import type {
  LoginResponseDefinition,
  LoginDefinitionDto,
} from "@/types/login.definition";

export class AuthRepository extends Http {
  constructor() {
    super(efirmaApiInstance);
  }

  async login(loginDto: LoginDefinitionDto) {
    try {
      const formData = new FormData();
      Object.entries(loginDto).forEach(([key, value]) =>
        formData.append(key, value)
      );
      const { user } = await this.post<LoginResponseDefinition>(
        "/api/v1/auth/login",
        formData
      );
      return user;
    } catch (error) {
      toast.error(error as string);
    }
  }
}
