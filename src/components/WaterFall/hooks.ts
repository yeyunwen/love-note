import { useCallback, useEffect, useReducer, useRef } from "react";
import { WaterFallState, WaterFallAction, WaterFallData } from "./types";
import { throttle } from "lodash-es";

const initialState: WaterFallState = {
  cardWidth: 0,
  positions: [],
  columnHeights: [],
  status: "idle",
};

function waterFallReducer(state: WaterFallState, action: WaterFallAction): WaterFallState {
  switch (action.type) {
    case "SET_CARD_WIDTH":
      return { ...state, cardWidth: action.payload };
    case "SET_POSITIONS":
      return { ...state, positions: action.payload };
    case "SET_COLUMN_HEIGHTS":
      return { ...state, columnHeights: action.payload };
    case "SET_STATUS":
      return { ...state, status: action.payload };
    default:
      return state;
  }
}

export function useWaterFallLayout<T>(
  containerRef: React.RefObject<HTMLDivElement>,
  listRef: React.RefObject<HTMLDivElement>,
  data: WaterFallData<T>[],
  column: number,
  gap: number,
) {
  const [state, dispatch] = useReducer(waterFallReducer, initialState);
  const observerRef = useRef<ResizeObserver | null>(null);

  const computeCardWidth = useCallback(() => {
    if (!containerRef.current) return 0;
    const width = containerRef.current.clientWidth - (column - 1) * gap;
    return width / column;
  }, [column, gap, containerRef]);

  const computePositions = useCallback(
    (cardWidth: number) => {
      if (!cardWidth) return [];

      return data.map((item) => {
        const imgHeight = (item.dimensions.height * cardWidth) / item.dimensions.width;
        return {
          width: cardWidth,
          imgHeight,
          x: 0,
          y: 0,
        };
      });
    },
    [data],
  );

  const computeRealPositions = useCallback(() => {
    if (!listRef.current || !state.cardWidth) return;

    const domList = Array.from(listRef.current.children);
    const columnHeights = new Array(column).fill(0);

    const newPositions = state.positions.map((pos, index) => {
      const cardHeight = domList[index]?.clientHeight ?? 0;
      if (!cardHeight) return pos;

      const minHeight = Math.min(...columnHeights);
      const minIndex = columnHeights.indexOf(minHeight);

      // 更新列高度
      columnHeights[minIndex] = minHeight + cardHeight + gap;

      return {
        ...pos,
        x: minIndex * (state.cardWidth + gap),
        y: minHeight,
      };
    });

    dispatch({ type: "SET_POSITIONS", payload: newPositions });
    dispatch({ type: "SET_COLUMN_HEIGHTS", payload: columnHeights });
  }, [column, gap, state.cardWidth, state.positions, listRef]);

  // 初始布局计算
  const computeLayout = useCallback(() => {
    const cardWidth = computeCardWidth();
    const positions = computePositions(cardWidth);
    dispatch({ type: "SET_CARD_WIDTH", payload: cardWidth });
    dispatch({ type: "SET_POSITIONS", payload: positions });
    dispatch({ type: "SET_STATUS", payload: "computing" });
  }, [computeCardWidth, computePositions]);

  // 监听容器大小变化
  useEffect(() => {
    if (containerRef.current && !observerRef.current) {
      observerRef.current = new ResizeObserver(
        throttle((entries) => {
          // 防止KeepAlive 失活时，不必要的计算
          const observerWidth = entries[0].target.clientWidth;
          if (observerWidth > 0) {
            computeLayout();
          }
        }, 200),
      );
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [computeLayout, containerRef]);

  // 计算真实位置
  useEffect(() => {
    if (state.status === "computing") {
      // 不使用 requestAnimationFrame，防止发起多次请求
      computeRealPositions();
      dispatch({ type: "SET_STATUS", payload: "idle" });
    }
  }, [state.status, computeRealPositions]);

  // 数据变化时重新计算布局
  useEffect(() => {
    computeLayout();
  }, [data, column, computeLayout]);

  return state;
}

export function useInfiniteScroll(
  loadingRef: React.RefObject<HTMLDivElement>,
  isFinish: boolean,
  isLoading: boolean,
  onReachBottom?: () => void,
) {
  // 使用 useRef 来存储最新的状态和回调
  const stateRef = useRef({ isFinish, isLoading, onReachBottom });

  // 更新 ref 中的值
  useEffect(() => {
    stateRef.current = { isFinish, isLoading, onReachBottom };
  }, [isFinish, isLoading, onReachBottom]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 获取最后一个元素 因为可能观察多次
        const entry = entries[entries.length - 1];
        const { isFinish, isLoading, onReachBottom } = stateRef.current;
        if (entry?.isIntersecting && !isFinish && !isLoading) {
          console.log("onReachBottom");
          onReachBottom?.();
        }
      },
      {
        root: null,
        threshold: 0,
      },
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [loadingRef]); // 只依赖 loadingRef
}
