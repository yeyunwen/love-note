import { useAliveController } from "react-activation";
import { KeepAliveContext } from "./context";

export const KeepAliveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { clear, dropScope, getCachingNodes } = useAliveController();

  const clearCache = () => {
    // 获取所有缓存的节点
    const nodes = getCachingNodes();
    console.log("nodes", nodes);

    // 清除所有缓存的节点
    nodes.forEach((node) => {
      if (node.name) {
        dropScope(node.name);
      }
    });

    // 最后调用 clear 确保清理完全
    clear();
  };

  return <KeepAliveContext.Provider value={{ clearCache }}>{children}</KeepAliveContext.Provider>;
};
