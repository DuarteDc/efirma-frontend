import { AuthRepository } from "@/repositories/auth.repository";
import type { LoginDefinitionDto } from "@/types/login.definition";
import { useState } from "react";

const authRepository = new AuthRepository();

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const toggleLoading = () => setLoading((prev) => !prev);

  const startLogin = async (loginDto: LoginDefinitionDto) => {
    toggleLoading();
    const user = await authRepository.login(loginDto);
    if (!user) return toggleLoading();
    toggleLoading();
    return user;
  };

  console.log({ loading });

  return {
    loading,
    startLogin,
  };
};
