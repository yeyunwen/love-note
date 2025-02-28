import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import store from "@/store";
import { logout } from "@/store/authSlice";
import RadixToast from "@/components/RadixToast";
import { Toast } from "@nutui/nutui-react";
import router from "@/router";

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
  (response: AxiosResponse<ApiResponse<any>>) => {
    const { code, data, message } = response.data;

    if (code === ErrorCode.未登录) {
      RadixToast.show(message || "未登录");
      store.dispatch(logout());
      router.navigate("/login");
      return Promise.reject(new Error(message));
    }

    if (code !== SUCCESS_CODE) {
      return Promise.reject(new Error(message));
    }

    return data;
  },
  (error: AxiosError<ApiResponse<any>>) => {
    const { response } = error;
    if (response) {
      const { code, message } = response.data;
      switch (code) {
        case ErrorCode.未登录: {
          Toast.show(message || "未登录");
          store.dispatch(logout());
          router.navigate("/login");
          break;
        }
        case ErrorCode.请求失败: {
          Toast.show(message || "请求失败");
          break;
        }
        case ErrorCode.服务器错误: {
          Toast.show(message || "服务器错误");
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
