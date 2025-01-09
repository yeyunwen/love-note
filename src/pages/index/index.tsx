import { useCallback, useEffect, useState, useRef } from "react";
import WaterFall from "@/components/WaterFall/index";
import { type WaterFallData } from "@/components/WaterFall/types";
import { Note, getNotesApi } from "@/api/note";
import NoteCard from "./components/NoteCard/index";
import style from "./index.module.scss";

// 转换 API 数据为 WaterFallData 格式
const transformNoteToWaterFallData = (note: Note): WaterFallData<Note> => ({
  dimensions: {
    width: note.images[0].width,
    height: note.images[0].height,
  },
  sourceData: note,
});

const Index: React.FC = () => {
  const [data, setData] = useState<WaterFallData<Note>[]>([]);
  const [isFinish, setIsFinish] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [column, setColumn] = useState(2);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(1);

  const handleReachBottom = useCallback(async () => {
    if (isFinish || isLoading) return;

    try {
      setIsLoading(true);
      const { items: notes, meta } = await getNotesApi({
        page: pageRef.current,
        limit: 5,
      });

      if (meta.page >= meta.totalPages) {
        setIsFinish(true);
      }

      pageRef.current += 1;

      const newData = notes.map(transformNoteToWaterFallData);
      setData((prev) => [...prev, ...newData]);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isFinish, isLoading]);

  // 监听容器宽度变化
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      let newColumn = 2;

      if (width > 960) {
        newColumn = 5;
      } else if (width >= 690) {
        newColumn = 4;
      } else if (width >= 500) {
        newColumn = 3;
      }

      setColumn(newColumn);
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className={style.indexContainer} ref={containerRef}>
      <WaterFall<Note>
        data={data}
        column={column}
        gap={10}
        isFinish={isFinish}
        isLoading={isLoading}
        onReachBottom={handleReachBottom}
      >
        {({ sourceData, imgHeight }) => (
          <NoteCard
            id={sourceData.id}
            imgHeight={imgHeight}
            url={sourceData.images[0].url}
            title={sourceData.title ?? ""}
            author={sourceData.user.username}
            avatar={sourceData.user.avatar}
          />
        )}
      </WaterFall>
    </div>
  );
};

export default Index;
