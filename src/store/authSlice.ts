import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  // 其他用户信息字段
}

interface AuthState {
  token: string | null;
  isLogin: boolean;
  user: User | null;
}

const initialState: AuthState = {
  token: null,
  isLogin: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ token: string; user: User }>) {
      state.isLogin = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout(state) {
      state.isLogin = false;
      state.token = null;
      state.user = null;
    },
    setLoginStatus(
      state,
      action: PayloadAction<{
        isLogin: boolean;
        token: string | null;
        user: User | null;
      }>
    ) {
      state.isLogin = action.payload.isLogin;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    updateUser(state, action: PayloadAction<User>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { login, logout, setLoginStatus, updateUser } = authSlice.actions;
export default authSlice.reducer;
