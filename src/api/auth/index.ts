import request from "@/utils/request";

type LoginFormDTO = {
  email: string;
  password: string;
};

type LoginByEmailResponse = {
  token: string;
};

export const loginByEmailApi = (data: LoginFormDTO) => {
  return request<LoginByEmailResponse>({
    url: "/auth/login/email",
    method: "POST",
    data,
  });
};
