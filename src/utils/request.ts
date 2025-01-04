import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import store from "@/store";
import { logout } from "@/store/authSlice";
import RadixToast from "@/components/RadixToast";

export interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}

export enum ErrorCode {
  /** 未登录 */
  未登录 = 401,
  /** 请求失败 */
  请求失败 = 400,
  /** 服务器错误 */
  服务器错误 = 500,
}

export const SUCCESS_CODE = 200;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  withCredentials: true,
  timeout: 30000,
});

axiosInstance.interceptors.request.use((config) => {
  const state = store.getState();
  const { token } = state.auth;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    const { code, data, message } = response.data as ApiResponse<any>;

    if (code === ErrorCode.未登录) {
      store.dispatch(logout());
      window.location.href = "/login";
      return Promise.reject(new Error(message));
    }

    if (code !== SUCCESS_CODE) {
      return Promise.reject(new Error(message));
    }

    return data;
  },
  (error) => {
    const { response } = error;

    if (response) {
      switch (response.status) {
        case ErrorCode.未登录: {
          store.dispatch(logout());
          window.location.href = "/login";
          break;
        }
        case ErrorCode.请求失败: {
          RadixToast.show(response.data.message);
          break;
        }
        case ErrorCode.服务器错误: {
          RadixToast.show(response.data.message);
          break;
        }
      }
    }
    return Promise.reject(error);
  },
);

const request = <T>(config: AxiosRequestConfig): Promise<T> => {
  return axiosInstance(config) as Promise<T>;
};

export default request;
