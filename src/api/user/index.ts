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
  createdAt: string;
  id: number;
  status: LoverRequestStatus;
  updatedAt: string;
  sender: {
    uid: string;
    username: string;
    gender: UserGender;
    avatar: string;
  };
  receiver: {
    uid: string;
    username: string;
    gender: UserGender;
    avatar: string;
  };
}

export interface UserInfo {
  id: number;
  uid: string;
  email: string;
  avatar: string;
  username: string;
  gender: UserGender;
  lover: Lover | null;
  // 收到的请求
  receivedRequests: LoverRequest[];
  // 发出的请求
  sentRequests: LoverRequest[];
  createdTime: string;
  updatedTime: string;
}

export enum LoverRequestStatus {
  待处理 = "待处理",
  已接受 = "已接受",
  已拒绝 = "已拒绝",
}

export const getUserInfoApi = () => {
  return request<UserInfo>({
    url: "/user/me",
    method: "GET",
  });
};

export const bindLoverApi = (loverUid: string) => {
  return request({
    url: "/user/lover/bind",
    method: "POST",
    data: { loverUid },
  });
};

export const rejectLoverRequestApi = (requestId: number) => {
  return request({
    url: "/user/lover/reject",
    method: "POST",
    data: { requestId },
  });
};

export const acceptLoverRequestApi = (requestId: number) => {
  return request({
    url: "/user/lover/accept",
    method: "POST",
    data: { requestId },
  });
};
