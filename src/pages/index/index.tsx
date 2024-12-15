import WaterFall, { type CardItem } from "@/components/WaterFall";
import style from "./index.module.scss";
import data from "./mock.json";
import NoteCard from "./components/NoteCard";
import { useEffect, useRef, useState } from "react";
import { getNotesApi } from "@/api/note";

const colorArr = ["#409eff", "#67c23a", "#e6a23c", "#f56c6c", "#909399"];

const Index = () => {
  const list: CardItem[] = data.data.items.map((i) => ({
    id: i.id,
    url: i.note_card.cover.url_pre,
    width: i.note_card.cover.width,
    height: i.note_card.cover.height,
    author: i.note_card.user.nickname,
    title: i.note_card.display_title,
  }));

  const getData = (page: number, pageSize: number) => {
    return new Promise<CardItem[]>((resolve) => {
      setTimeout(() => {
        resolve(
          list.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize)
        );
      }, 1000);
    });
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
    getNotesApi();

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
            {({ item, index, imgHeight }) => {
              return NoteCard({
                detail: {
                  bgColor: colorArr[index % (colorArr.length - 1)],
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
