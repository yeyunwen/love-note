import React, { memo, useRef, useEffect } from "react";
import { WaterFallProps } from "./types";
import { useWaterFallLayout, useInfiniteScroll } from "./hooks";
import { WaterFallErrorBoundary } from "./ErrorBoundary";
import { orbit } from "ldrs";
import style from "./index.module.scss";

orbit.register();

const defaultProps = {
  column: 2,
  gap: 10,
  isLoading: false,
  isFinish: false,
  needLoading: true,
} as const;

const WaterFallItem = memo<{
  width: number;
  x: number;
  y: number;
  children: React.ReactNode;
}>(({ width, x, y, children }) => (
  <section
    className={style.waterFallItem}
    style={{
      width: `${width}px`,
      transform: `translate(${x}px,${y}px)`,
    }}
  >
    {children}
  </section>
));

const LoadingIndicator = memo<{ isFinish: boolean }>(({ isFinish }) => (
  <div className={style.waterFallLoading}>
    {isFinish ? (
      <span>没有更多数据了</span>
    ) : (
      <>
        <l-orbit size="30" speed="1.5" color="#9A9898" />
        <span>加载中</span>
      </>
    )}
  </div>
));

const WaterFall = <T,>(props: WaterFallProps<T>): React.ReactElement => {
  const { column, gap, data, isFinish, isLoading, children, onReachBottom } = {
    ...defaultProps,
    ...props,
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { positions, columnHeights } = useWaterFallLayout(
    containerRef,
    listRef, // 传入 listRef
    data,
    column,
    gap,
  );

  useInfiniteScroll(loadingRef, isLoading, isFinish, onReachBottom);

  // 解决瀑布流加载时，底部内容高度小于视口高度，导致无法触发 onReachBottom 的问题
  useEffect(() => {
    // 检查内容高度是否小于视口高度
    if (
      containerRef.current &&
      Math.max(...columnHeights) < containerRef.current.clientHeight &&
      !isLoading &&
      !isFinish
    ) {
      onReachBottom?.();
    }
  }, [columnHeights, isLoading, isFinish, onReachBottom]);

  return (
    <WaterFallErrorBoundary>
      <div
        ref={containerRef}
        className={style.waterFallContainer}
        role="grid"
        aria-label="Waterfall gallery"
      >
        <div
          ref={listRef}
          className={style.waterFallList}
          role="row"
          style={{ height: `${Math.max(...columnHeights)}px` }}
        >
          {positions.map((item, index) => {
            // 当父组件reload刷新数据后，positions的值在 Waterfall 重新 render 的时候还是之前的长度，此时需要过滤掉多余的
            if (index > data.length - 1) return;
            return (
              <WaterFallItem
                key={`waterfall-item-${index}`}
                width={item.width}
                x={item.x}
                y={item.y}
              >
                {children?.({
                  sourceData: data[index].sourceData,
                  imgHeight: item.imgHeight,
                })}
              </WaterFallItem>
            );
          })}
        </div>
        {isLoading && (
          <div ref={loadingRef}>
            <LoadingIndicator isFinish={isFinish ?? false} />
          </div>
        )}
      </div>
    </WaterFallErrorBoundary>
  );
};

export default WaterFall;
