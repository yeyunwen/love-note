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
  data: CardItem;
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

  const computedCardWidth = () => {
    if (waterFallRef.current) {
      const width =
        waterFallRef.current.clientWidth - (props.column! - 1) * props.gap!;
      return width / props.column!;
    }
    return 0;
  };

  const waterFallRef = useRef<HTMLDivElement>(null);
  const [curPage, setCurPage] = useState(1);
  const [wateFallList, setWateFallList] = useState<WaterFallItem[]>([]);
  const cardWidth = computedCardWidth();
  console.log("cardWidth", cardWidth);

  const fetchData = async (page: number, pageSize: number) => {
    const data = await props.request(page, pageSize);
    const imgPos = computedImgHeight(data);
    setWateFallList([...wateFallList, ...imgPos]);
  };

  useEffect(() => {
    fetchData(curPage, props.pageSize!);
  }, []);

  const computedImgHeight = (list: CardItem[]): WaterFallItem[] => {
    return list.map((item) => {
      const imgHeight = (item.height * cardWidth) / item.width;
      return {
        data: item,
        width: cardWidth,
        imgHeight,
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

  return (
    <div className={style.waterFallContainer} ref={waterFallRef}>
      <div className={style.waterFallList}>
        {wateFallList.map((item, index) => {
          return (
            <section
              className={style.waterFallItem}
              key={item.data.id}
              style={{
                width: `${cardWidth}px`,
                transform: `translate(${item.x}px,${item.y}px)`,
                transition: "all 0.3s",
              }}
            >
              {props.children
                ? props.children({
                    data: item.data,
                    index,
                    imgHeight: item.imgHeight,
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
