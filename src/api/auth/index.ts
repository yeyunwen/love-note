import request from "@/utils/request";

type LoginFormDTO = {
  email: string;
  password: string;
};

export const loginByEmailApi = (data: LoginFormDTO) => {
  return request("/auth/login/email", {
    method: "POST",
    data,
  });
};
