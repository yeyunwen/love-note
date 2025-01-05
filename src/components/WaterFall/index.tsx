import { useEffect, useRef, useState } from "react";
import style from "./index.module.scss";
import { throttle } from "lodash-es";

export interface CardItem {
  id: number;
  url: string;
  height: number;
  title?: string;
  author: string;
  avatar: string;
  [key: string]: any;
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
  pageSize?: number;
  /** 底部距离触发刷新 */
  bottomGapToFetch?: number;
  request: (page: number, pageSize: number) => Promise<CardItem[]>;
  children?: WaterFallChildren;
};

const defaultProps = {
  column: 2,
  gap: 10,
  pageSize: 5,
  bottomGapToFetch: 20,
};

const WaterFall = (props: WaterFallProps) => {
  props = { ...defaultProps, ...props };

  const waterFallRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const containerObserverRef = useRef<ResizeObserver | null>(null);
  const lastWidth = useRef(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [curPage, setCurPage] = useState(1);
  const [cardWidth, setCardWidth] = useState(0);
  const [fetchList, setFetchList] = useState<CardItem[]>([]); // 增量获取的数据
  const [allFetchList, setAllFetchList] = useState<CardItem[]>([]); // 全量获取的数据
  const [allPosList, setAllPosList] = useState<CardPos[]>([]); // 全量获取的数据的位置
  const [columnHeightList, setColumnHeightList] = useState<number[]>( // 每列的当前的高度
    new Array(props.column).fill(0),
  );
  const [needInitColumn, setNeedInitColumn] = useState(false);
  const computedCardWidth = () => {
    if (waterFallRef && waterFallRef.current) {
      const width = waterFallRef.current.clientWidth - (props.column! - 1) * props.gap!;
      return width / props.column!;
    }
    return 0;
  };

  const fetchData = async (page: number, pageSize: number) => {
    if (isLoading || isFinish) {
      return;
    }
    setIsLoading(true);
    const data = await props.request(page, pageSize);
    if (data.length < pageSize) {
      setIsFinish(true);
    }
    setFetchList(data);
    setAllFetchList([...allFetchList, ...data]);
    const imgPos = computedImgHeight(data);
    setAllPosList([...allPosList, ...imgPos]);
    setIsLoading(false);
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

  const handleScroll = throttle(() => {
    if (waterFallRef.current) {
      const { scrollTop, clientHeight, scrollHeight } = waterFallRef.current;
      const bottomGap = scrollHeight - scrollTop - clientHeight;

      if (bottomGap <= props.bottomGapToFetch!) {
        setCurPage(curPage + 1);
        fetchData(curPage + 1, props.pageSize!);
      }
    }
  }, 100);

  // 挂载初始化
  useEffect(() => {
    console.log("WaterFall 挂载初始化");
    fetchData(curPage, props.pageSize!);

    if (waterFallRef.current && !containerObserverRef.current) {
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

    return () => {
      if (containerObserverRef.current) {
        containerObserverRef.current.disconnect();
        containerObserverRef.current = null;
      }
    };
  }, []);

  /**
   * 滚动、fetch数据更新
   * 增量计算 pos
   */
  useEffect(() => {
    if (fetchList.length) {
      console.log("update fetch", fetchList);

      const realPos = computedRealPos(fetchList);
      setAllPosList(allPosList.slice(0, allPosList.length - fetchList.length).concat(realPos));
    }
  }, [fetchList]);

  /**
   * 父组件宽度改变 column
   * 组件自身宽度改变 cardWidth
   * 全量计算 pos
   */
  useEffect(() => {
    console.log("WaterFall 父组件宽度改变 column");
    const imgPos = computedImgHeight(allFetchList);
    setAllPosList(imgPos);
    setFetchList([...allFetchList]);
    setNeedInitColumn(true);
  }, [props.column, cardWidth]);

  return (
    <div className={style.waterFallContainer} ref={waterFallRef} onScroll={handleScroll}>
      <div className={style.waterFallList} ref={listRef}>
        {allFetchList.map((item, index) => {
          return (
            <section
              className={style.waterFallItem}
              key={item.id}
              style={{
                width: `${allPosList[index].width}px`,
                transform: `translate(${allPosList[index].x}px,${allPosList[index].y}px)`,
                // transition: "all 0.3s",
              }}
            >
              {props.children
                ? props.children({
                    item,
                    index,
                    imgHeight: allPosList[index].imgHeight,
                  })
                : null}
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default WaterFall;
