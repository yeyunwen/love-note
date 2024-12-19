import axios from "axios";
import store from "@/store";
import { logout } from "@/store/authSlice";
import emitter from "@/utils/mitt";

export enum ErrorCode {
  /** 未登录 */
  未登录 = 401,
  /** 请求失败 */
  请求失败 = 400,
  /** 服务器错误 */
  服务器错误 = 500,
}

export const errorInfoMap = {
  [ErrorCode.未登录]: {
    message: "未登录",
    redirect: "/login",
  },
  [ErrorCode.请求失败]: {
    message: "请求失败",
  },
};

const axiosInstance = axios.create({
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
    if (response.status === ErrorCode.未登录) {
      store.dispatch(logout());
      window.location.href = errorInfoMap[ErrorCode.未登录].redirect;
    }
    return response;
  },
  (error) => {
    const { response } = error;
    switch (response.status) {
      case ErrorCode.未登录:
        store.dispatch(logout());
        window.location.href = errorInfoMap[ErrorCode.未登录].redirect;
        break;
      case ErrorCode.请求失败:
        emitter.emit("showToast", response.data.message);
        return Promise.reject(error);
      case ErrorCode.服务器错误:
        emitter.emit("showToast", response.data.message);
        return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
