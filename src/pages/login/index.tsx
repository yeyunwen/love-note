import React from "react";
import styles from "./index.module.scss";
import { useForm, SubmitHandler } from "react-hook-form";
import { loginByEmailApi } from "@/api/auth";
const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <div className={styles.errorMessageWrapper}>
      <span className={styles.errorMessage}>{message}</span>
    </div>
  );
};

type LoginForm = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();
  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    const res = await loginByEmailApi(data);
    // TODO: 登录成功后跳转到首页
    console.log("登录成功", res);
  };
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <h1>love note</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="邮箱"
            className={styles.input}
            {...register("email", { required: true })}
          />
          {errors.email && <ErrorMessage message="邮箱是必填项" />}
          <input
            type="password"
            placeholder="密码"
            className={styles.input}
            {...register("password", { required: true })}
          />
          {errors.password && <ErrorMessage message="密码是必填项" />}
          <button type="submit" className={styles.button}>
            登录
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
