import WaterFall, { type CardItem } from "@/components/WaterFall";
import style from "./index.module.scss";
import NoteCard from "./components/NoteCard";
import { useEffect, useRef, useState } from "react";
import { getNotesApi } from "@/api/note";

const Index = () => {
  const getData = async (page: number, limit: number): Promise<CardItem[]> => {
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
  };

  const fContainerRef = useRef<HTMLDivElement>(null);
  const [column, setColumn] = useState(0);
  const fContainerObserver = new ResizeObserver((entries) => {
    console.log("reset");

    changeColumn(entries[0].target.clientWidth);
  });

  const changeColumn = (width: number) => {
    let column = 2;
    if (width > 960) {
      console.log(5);
      column = 5;
    } else if (width >= 690 && width < 960) {
      console.log(4);
      column = 4;
    } else if (width >= 500 && width < 690) {
      console.log(3);
      column = 3;
    } else {
      console.log(2);
      column = 2;
    }

    setColumn(column);
  };

  useEffect(() => {
    if (fContainerRef.current) {
      fContainerObserver.observe(fContainerRef.current);
    }

    return () => {
      fContainerObserver.disconnect();
    };
  }, []);

  return (
    <div className={style.indexContainer} ref={fContainerRef}>
      <main>
        {/* 如果默认值是2，可实际计算是3，waterfall会出现问题
        核心原因还是需要计算图片高度渲染好之后，才能计算卡片高度，一共2次渲染 */}
        {column && (
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
