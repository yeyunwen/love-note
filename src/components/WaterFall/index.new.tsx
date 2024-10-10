import { useEffect, useRef, useState } from "react";
import style from "./index.module.scss";
import { throttle } from "lodash-es";

export interface CardItem {
  id: string | number;
  url: string;
  height: number;
  title: string;
  author: string;
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

type WaterFallItem = {
  data: CardItem;
} & CardPos;

type WaterFallProps = {
  column?: number;
  gap?: number;
  pageSize?: number;
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
  const isInit = useRef<boolean>(false);
  const listRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [curPage, setCurPage] = useState(1);

  const [fetchList, setFetchList] = useState<CardItem[]>([]);
  const [allFetchList, setAllFetchList] = useState<CardItem[]>([]);
  const [allPosList, setAllPosList] = useState<CardPos[]>([]);
  const [columnHeightList, setColumnHeightList] = useState<number[]>(
    new Array(props.column).fill(0)
  );
  const computedCardWidth = () => {
    if (waterFallRef && waterFallRef.current) {
      const width =
        waterFallRef.current.clientWidth - (props.column! - 1) * props.gap!;
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
    const cardWidth = computedCardWidth();
    const domList = Array.from(listRef.current!.children).slice(-list.length);
    const tempColumnHeightList =
      columnHeightList.length === props.column
        ? [...columnHeightList]
        : new Array(props.column).fill(0);

    console.log("tempColumnHeightList", tempColumnHeightList);

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
  }, 1000);

  // 挂载初始化
  useEffect(() => {
    isInit.current = true;
    fetchData(curPage, props.pageSize!);
  }, []);

  // 更新、滚动（增量）
  useEffect(() => {
    if (fetchList.length) {
      console.log("update fetch", fetchList);

      const realPos = computedRealPos(fetchList);
      setAllPosList(
        allPosList
          .slice(0, allPosList.length - fetchList.length)
          .concat(realPos)
      );
    }
  }, [fetchList]);

  // 父组件宽度改变 column 全量计算 pos
  useEffect(() => {
    const imgPos = computedImgHeight(allFetchList);
    setAllPosList(imgPos);
    setFetchList([...allFetchList]);
    console.log("props.column change =====");
    console.log("allFetchList", allFetchList);
    console.log("fetchList", fetchList);
    console.log("isInit.current", isInit.current);
  }, [props.column]);

  return (
    <div
      className={style.waterFallContainer}
      ref={waterFallRef}
      onScroll={handleScroll}
    >
      <div className={style.waterFallList} ref={listRef}>
        {allFetchList.map((item, index) => {
          return (
            <section
              className={style.waterFallItem}
              key={item.id}
              style={{
                width: `${allPosList[index].width}px`,
                transform: `translate(${allPosList[index].x}px,${allPosList[index].y}px)`,
                transition: "all 0.3s",
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
