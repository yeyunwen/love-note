import { useEffect, useRef } from "react";

/**
 * 自定义 Hook，只在依赖项更新时执行回调，跳过首次渲染
 * @param callback 依赖项更新时要执行的回调函数
 * @param dependencies 依赖项数组
 */
function useOnUpdate(callback: () => void, dependencies: React.DependencyList = []) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    // 跳过首次渲染
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // 非首次渲染时执行回调
    callback();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}

export default useOnUpdate;
