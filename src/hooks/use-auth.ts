import { use, useState } from "react";
import { AuthContext } from "@/context/auth";
import { AuthRepository } from "@/repositories/auth.repository";
import type { LoginDefinitionDto } from "@/types/login.definition";

const authRepository = new AuthRepository();

export const useAuth = () => {
  const { handleLogin } = use(AuthContext);
  const [loading, setLoading] = useState(false);

  const toggleLoading = () => setLoading((prev) => !prev);

  console.log(handleLogin);
  const startLogin = async (loginDto: LoginDefinitionDto) => {
    toggleLoading();
    const user = await authRepository.login(loginDto);
    if (!user) return toggleLoading();
    handleLogin(user);
    toggleLoading();
    return user;
  };

  console.log({ loading });

  return {
    loading,
    startLogin,
  };
};
