import { useEffect, useRef, useState } from "react";
import style from "./index.module.scss";
import { throttle } from "lodash-es";
import { orbit } from "ldrs";

orbit.register();

export interface CardItem {
  id: number;
  url: string;
  height: number;
  width: number;
  title?: string;
  author: string;
  avatar: string;
}

export interface CardPos {
  width: number;
  imgHeight: number;
  x: number;
  y: number;
}

export type WaterFallChildren = (data: {
  item: CardItem;
  index: number;
  imgHeight: number;
}) => React.ReactNode;

type WaterFallProps = {
  column?: number;
  gap?: number;
  data: CardItem[];
  isFinish?: boolean;
  needLoading?: boolean;
  children?: WaterFallChildren;
  onReachBottom?: () => void;
};

const defaultProps: WaterFallProps = {
  column: 2,
  gap: 10,
  isFinish: false,
  needLoading: true,
  data: [],
};

const WaterFall: React.FC<WaterFallProps> = (p) => {
  const props = { ...defaultProps, ...p };

  const waterFallRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const containerObserverRef = useRef<ResizeObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const lastWidth = useRef(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [allPosList, setAllPosList] = useState<CardPos[]>([]); // 全量获取的数据的位置
  const [columnHeightList, setColumnHeightList] = useState<number[]>( // 每列的当前的高度
    new Array(props.column).fill(0),
  );
  const [needInitColumn, setNeedInitColumn] = useState(false);
  const [needComputeRealPos, setNeedComputeRealPos] = useState(false);
  const computedCardWidth = () => {
    if (waterFallRef && waterFallRef.current) {
      const width = waterFallRef.current.clientWidth - (props.column! - 1) * props.gap!;
      return width / props.column!;
    }
    return 0;
  };

  const computedImgHeight = (list: CardItem[]): CardPos[] => {
    const cardWidth = computedCardWidth();
    console.log("cardWidth", cardWidth);

    return list.map((item) => {
      const imgHeight = (item.height * cardWidth) / item.width;
      return {
        width: cardWidth,
        imgHeight,
        x: 0,
        y: 0,
      };
    });
  };

  const computedRealPos = (list: CardItem[]): CardPos[] => {
    const getColumnHeightList = () => {
      if (needInitColumn) {
        return new Array(props.column).fill(0);
      }
      return [...columnHeightList];
    };

    const cardWidth = computedCardWidth();
    const domList = Array.from(listRef.current!.children).slice(-list.length);
    const tempColumnHeightList = getColumnHeightList();
    const result = list.map((item, i) => {
      const cardHeight = domList[i].clientHeight;
      const minColumn = Math.min(...tempColumnHeightList);
      const minIndex = tempColumnHeightList.indexOf(minColumn);
      const imgHeight = (item.height * cardWidth) / item.width;
      tempColumnHeightList[minIndex] += cardHeight + props.gap!;
      return {
        ...allPosList[allPosList.length - list.length + i],
        width: cardWidth,
        imgHeight,
        x: minIndex * cardWidth + minIndex * props.gap!,
        y: minColumn,
      };
    });
    setColumnHeightList([...tempColumnHeightList]);
    setNeedInitColumn(false);

    return result;
  };

  // 挂载初始化 注册监听事件
  useEffect(() => {
    if (waterFallRef.current && !containerObserverRef.current) {
      // 监听容器宽度变化
      containerObserverRef.current = new ResizeObserver(
        throttle((entries) => {
          const observerWidth = entries[0].target.clientWidth;
          // 防止KeepAlive 失活时，不必要的计算
          if (observerWidth > 0) {
            lastWidth.current = computedCardWidth();
            setCardWidth(computedCardWidth());
          }
        }, 200),
      );
      containerObserverRef.current.observe(waterFallRef.current);
    }

    // 监听loading组件是否进入可视区域
    const loadingObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log("loading组件进入可视区域");
          props.onReachBottom?.();
        }
      },
      {
        root: null,
        threshold: 0,
      },
    );

    if (loadingRef.current) {
      loadingObserver.observe(loadingRef.current);
    }

    return () => {
      if (containerObserverRef.current) {
        containerObserverRef.current.disconnect();
        containerObserverRef.current = null;
      }
      loadingObserver.disconnect();
    };
  }, []);

  /**
   * 全量计算 realPos
   */
  useEffect(() => {
    if (needComputeRealPos) {
      const realPos = computedRealPos(props.data);
      setAllPosList(realPos);
      setNeedComputeRealPos(false);
    }
  }, [needComputeRealPos]);

  /**
   * 父组件宽度改变 column
   * 组件自身宽度改变 cardWidth
   * 数据改变 data
   * 全量计算 imgPos
   */
  useEffect(() => {
    console.log("WaterFall 父组件宽度改变 column");
    const imgPos = computedImgHeight(props.data);
    setAllPosList(imgPos);
    // setFetchList([...allFetchList]);
    setNeedInitColumn(true);
    setNeedComputeRealPos(true);
  }, [props.column, cardWidth, props.data]);

  return (
    <div ref={waterFallRef} className={style.waterFallContainer}>
      <div
        ref={listRef}
        className={style.waterFallList}
        style={{ height: `${Math.max(...columnHeightList)}px` }}
      >
        {allPosList.map((item, index) => {
          return (
            <section
              className={style.waterFallItem}
              key={props.data[index].id}
              style={{
                width: `${item.width}px`,
                transform: `translate(${item.x}px,${item.y}px)`,
                // transition: "all 0.3s",
              }}
            >
              {props.children
                ? props.children({
                    item: props.data[index],
                    index,
                    imgHeight: item.imgHeight,
                  })
                : null}
            </section>
          );
        })}
      </div>
      <div ref={loadingRef} className={style.waterFallLoading}>
        {props.isFinish ? (
          <span>没有更多数据了</span>
        ) : props.needLoading ? (
          <>
            <l-orbit size="30" speed="1.5" color="#9A9898"></l-orbit>
            <span>加载中</span>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default WaterFall;
