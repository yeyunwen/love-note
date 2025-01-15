import request from "@/utils/request";

export enum UserGender {
  未知 = 0,
  男 = 1,
  女 = 2,
}

export interface Lover {
  uid: string;
  avatar: string;
  username: string;
  gender: UserGender;
}

export interface LoverRequest {
  uid: string;
  avatar: string;
  username: string;
  gender: UserGender;
}

export interface UserInfo {
  id: number;
  uid: string;
  email: string;
  avatar: string;
  username: string;
  gender: UserGender;
  lover: Lover | null;
  loverRequest: LoverRequest | null;
  createdTime: string;
  updatedTime: string;
}

export const getUserInfoApi = () => {
  return request<UserInfo>({
    url: "/user/me",
    method: "GET",
  });
};
