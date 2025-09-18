import { toast } from "sonner";

import { efirmaApiInstance } from "@/libs/http/conf";
import { Http } from "@/libs/http/http";
import type {
  LoginResponseDefinition,
  LoginDefinitionDto,
} from "@/types/login.definition";
import { storage } from "@/libs/storage/storage";

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
      storage.set("refresh", user.refreshToken);
      storage.set("session", user.accessToken);
      return user;
    } catch (error) {
      toast.error(error as string);
    }
  }

  async getSession() {
    try {
      const token = storage.get<string>("refresh")!;
      const { user } = await this.post<LoginResponseDefinition>(
        "/api/v1/auth/refresh",
        {
          token,
        }
      );

      storage.set("session", user.accessToken);

      return { ...user, refreshToken: token };
    } catch (error) {
      console.log(error);
    }
  }
}
