import { useAppSelector } from "@/store/hooks";
import KeepAlive from "react-activation";

// 创建一个高阶组件来处理 KeepAlive 的条件
const WithKeepAlive: React.FC<{
  name: string;
  children: React.ReactNode;
}> = ({ name, children }) => {
  const isAuthenticated = useAppSelector((state) => !!state.auth.token);

  // 使用 when 属性来控制是否需要缓存
  // 只有在用户已登录时才缓存
  return (
    <KeepAlive name={name} cacheKey={`${name}-${isAuthenticated}`} when={isAuthenticated}>
      {children}
    </KeepAlive>
  );
};

export default WithKeepAlive;
