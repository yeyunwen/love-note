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
  }, [column, gap]);

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
  }, [column, gap, state.cardWidth, state.positions]);

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
        throttle(() => {
          computeLayout();
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
  }, [computeLayout]);

  // 计算真实位置
  useEffect(() => {
    if (state.status === "computing") {
      // 使用 requestAnimationFrame 确保 DOM 已更新
      requestAnimationFrame(() => {
        computeRealPositions();
        dispatch({ type: "SET_STATUS", payload: "idle" });
      });
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
  onReachBottom: (() => void) | undefined,
  isFinish: boolean,
) {
  useEffect(() => {
    const loadingObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFinish) {
          onReachBottom?.();
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0,
      },
    );

    if (loadingRef.current) {
      loadingObserver.observe(loadingRef.current);
    }

    return () => {
      loadingObserver.disconnect();
    };
  }, [isFinish, onReachBottom]);
}
