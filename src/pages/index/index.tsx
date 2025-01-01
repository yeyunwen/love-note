import WaterFall, { type CardItem } from "@/components/WaterFall";
import style from "./index.module.scss";
import NoteCard from "./components/NoteCard";
import { useEffect, useRef, useState, useCallback } from "react";
import { getNotesApi } from "@/api/note";

const Index = () => {
  const fContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const lastWidth = useRef(0);
  const [column, setColumn] = useState(0);

  // 使用 useCallback 缓存 getData 函数
  const getData = useCallback(async (page: number, limit: number): Promise<CardItem[]> => {
    const { items: notes } = await getNotesApi({ page, limit });
    return notes.map((i) => ({
      id: i.id,
      url: i.images[0].url,
      width: i.images[0].width,
      height: i.images[0].height,
      author: i.user.username,
      title: i.title,
      avatar: i.user.avatar,
    }));
  }, []);

  const changeColumn = (width: number) => {
    let column = 2;
    if (width > 960) {
      column = 5;
    } else if (width >= 690 && width < 960) {
      column = 4;
    } else if (width >= 500 && width < 690) {
      column = 3;
    } else {
      column = 2;
    }

    setColumn(column);
  };

  // 初始化 observer
  useEffect(() => {
    if (fContainerRef.current) {
      observerRef.current = new ResizeObserver((entries) => {
        const currentWidth = entries[0].target.clientWidth;
        // 防止KeepAlive 失活时，不必要的计算
        if (currentWidth > 0) {
          if (lastWidth.current !== currentWidth) {
            changeColumn(currentWidth);
            lastWidth.current = currentWidth;
          }
        }
      });
      observerRef.current.observe(fContainerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  return (
    <div className={style.indexContainer} ref={fContainerRef}>
      <main>
        {/* 如果默认值是2，可实际计算是3，waterfall会出现问题
        核心原因还是需要计算图片高度渲染好之后，才能计算卡片高度，一共2次渲染 */}
        {column > 0 && (
          <WaterFall request={getData} column={column}>
            {({ item, imgHeight }) => {
              return NoteCard({
                detail: {
                  imgHeight,
                  ...item,
                },
              });
            }}
          </WaterFall>
        )}
      </main>
    </div>
  );
};

export default Index;
