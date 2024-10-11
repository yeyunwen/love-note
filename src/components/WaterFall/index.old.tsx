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
  console.log("props.column", props.column);

  const waterFallRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [curPage, setCurPage] = useState(1);
  const [dataList, setDataList] = useState<CardItem[]>([]);
  const [posList, setPosList] = useState<CardPos[]>([]);
  const [cardWidth, setCardWidth] = useState(0);
  const [columnHeight, setColumnHeight] = useState(
    new Array(props.column).fill(0)
  );
  const [imageHeightComputed, setImageHeightComputed] = useState(false);
  const [fetchList, setFetchList] = useState<CardItem[]>([]);

  const getData = async (page: number, pageSize: number) => {
    const fetchList = await props.request(page, pageSize);
    setFetchList(fetchList);
    setDataList([...dataList, ...fetchList]);
    const imgPos = computedImgHeight(fetchList); // 增量计算
    setImageHeightComputed(true);
    setPosList([...posList, ...imgPos]);
  };

  const computedCardWidth = () => {
    if (waterFallRef.current) {
      const width =
        waterFallRef.current.clientWidth - (props.column! - 1) * props.gap!;
      return width / props.column!;
    }
    return 0;
  };

  const computedImgHeight = (list: CardItem[]): CardPos[] => {
    const cardWidth = computedCardWidth();
    return list.map((item) => {
      const imgHeight = (item.height * cardWidth) / item.width;
      return {
        width: cardWidth,
        imgHeight: imgHeight,
        x: 0,
        y: 0,
      };
    });
  };

  const computedRealPos = (
    list: CardItem[],
    columnHeightList?: number[]
  ): CardPos[] => {
    const domList = Array.from(listRef.current!.children).slice(-list.length);
    const cardWidth = computedCardWidth();
    const tempColumnHeight = columnHeightList
      ? columnHeightList
      : [...columnHeight];
    const result = list.map((item, i) => {
      const cardHeight = domList[i].getBoundingClientRect().height;
      const minColumn = Math.min(...tempColumnHeight);
      const minIndex = tempColumnHeight.indexOf(minColumn);
      const y = minColumn;
      tempColumnHeight[minIndex] += cardHeight + props.gap!;
      return {
        ...posList[posList.length - list.length + i],
        x: minIndex * cardWidth + minIndex * props.gap!,
        y,
      };
    });
    setColumnHeight([...tempColumnHeight]);

    return result;
  };

  const handleScroll = throttle(() => {
    if (waterFallRef.current) {
      const { scrollTop, clientHeight, scrollHeight } = waterFallRef.current;
      const bottomGap = scrollHeight - scrollTop - clientHeight;

      if (bottomGap <= props.bottomGapToFetch!) {
        setCurPage(curPage + 1);
        getData(curPage + 1, props.pageSize!);
      }
    }
  }, 1000);

  useEffect(() => {
    setCardWidth(computedCardWidth());
    getData(curPage, props.pageSize!);
    // const containerObserver = new ResizeObserver(() => {
    //   setCardWidth(computedCardWidth());
    // });
    // if (waterFallRef.current) {
    //   containerObserver.observe(waterFallRef.current);

    //   return () => {
    //     containerObserver.disconnect();
    //   };
    // }
  }, []);

  useEffect(() => {
    if (imageHeightComputed) {
      const realPos = computedRealPos(fetchList);
      setPosList(
        posList.slice(0, posList.length - fetchList.length).concat(realPos)
      );
      setImageHeightComputed(false);
    }
  }, [imageHeightComputed]);

  useEffect(() => {
    setCardWidth(computedCardWidth());
    const imgPos = computedImgHeight(dataList);
    setImageHeightComputed(true);
    setPosList([...posList, ...imgPos]);
    const realPos = computedRealPos(dataList, new Array(props.column).fill(0));
    setPosList([...realPos]);
    setImageHeightComputed(false);
  }, [props.column]);

  return (
    <div
      className={style.waterFallContainer}
      ref={waterFallRef}
      onScroll={handleScroll}
    >
      <div className={style.waterFallList} ref={listRef}>
        {dataList.map((item, index) => {
          return (
            <section
              className={style.waterFallItem}
              key={item.id}
              style={{
                width: `${cardWidth}px`,
                transform: `translate(${posList[index].x}px,${posList[index].y}px)`,
                transition: "all 0.3s",
              }}
            >
              {props.children
                ? props.children({
                    item,
                    index,
                    imgHeight: posList[index].imgHeight,
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
