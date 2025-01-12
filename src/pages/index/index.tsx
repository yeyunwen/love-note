import { useCallback, useEffect, useRef, useReducer } from "react";
import WaterFall from "@/components/WaterFall/index";
import { type WaterFallData } from "@/components/WaterFall/types";
import { Note, getNotesApi } from "@/api/note";
import NoteCard from "./components/NoteCard/index";
import style from "./index.module.scss";
import SvgIcon from "@/components/SvgIcon";
import Toast from "@/components/Toast";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 转换 API 数据为 WaterFallData 格式
const transformNoteToWaterFallData = (note: Note): WaterFallData<Note> => {
  return {
    dimensions: {
      width: note.images[0].width,
      height: note.images[0].height,
    },
    sourceData: note,
  };
};

// 定义状态和动作类型
type State = {
  data: WaterFallData<Note>[];
  isFinish: boolean;
  isLoading: boolean;
  isReloading: boolean;
  column: number;
  page: number;
};

type Action =
  | { type: "SET_DATA"; payload: WaterFallData<Note>[] }
  | { type: "SET_FINISH"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_RELOADING"; payload: boolean }
  | { type: "SET_COLUMN"; payload: number }
  | { type: "SET_PAGE"; payload: number };

// 定义reducer
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_DATA":
      return { ...state, data: action.payload };
    case "SET_FINISH":
      return { ...state, isFinish: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_RELOADING":
      return { ...state, isReloading: action.payload };
    case "SET_COLUMN":
      return { ...state, column: action.payload };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    default:
      return state;
  }
};

const Index: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, {
    data: [],
    isFinish: false,
    isLoading: false,
    isReloading: false,
    column: 2,
    page: 1,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const getData = async (page: number, limit: number) => {
    const { items: notes, meta } = await getNotesApi({
      page,
      limit,
    });
    const data = notes.map(transformNoteToWaterFallData);

    return {
      data,
      meta,
    };
  };

  const handleReachBottom = useCallback(async () => {
    if (state.isFinish || state.isLoading || state.isReloading) return;

    dispatch({ type: "SET_LOADING", payload: true });

    const { data, meta } = await getData(state.page, 5);

    dispatch({ type: "SET_DATA", payload: [...state.data, ...data] });
    dispatch({ type: "SET_PAGE", payload: meta.page + 1 });

    if (meta.page >= meta.totalPages) {
      dispatch({ type: "SET_FINISH", payload: true });
    }

    dispatch({ type: "SET_LOADING", payload: false });
  }, [state.data, state.page, state.isFinish, state.isLoading, state.isReloading]);

  const handleReload = useCallback(async () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }

    dispatch({ type: "SET_RELOADING", payload: true });
    await sleep(3000);

    dispatch({ type: "SET_FINISH", payload: false });
    dispatch({ type: "SET_PAGE", payload: 1 });

    const { data, meta } = await getData(1, 5);

    dispatch({ type: "SET_DATA", payload: [...data] });
    dispatch({ type: "SET_PAGE", payload: meta.page + 1 });
    dispatch({ type: "SET_RELOADING", payload: false });

    Toast.show({
      message: "刷新成功~",
    });
  }, []);

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

      dispatch({ type: "SET_COLUMN", payload: newColumn });
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className={style.indexContainer}>
      <div className={style.reloadContainer} style={{ height: state.isReloading ? "64px" : "0" }}>
        <SvgIcon name="reload" className={style.reloadIcon} />
      </div>
      <div ref={containerRef} className={style.noteContainer}>
        <WaterFall<Note>
          data={state.data}
          column={state.column}
          gap={10}
          isFinish={state.isFinish}
          isLoading={state.isLoading}
          onReachBottom={handleReachBottom}
        >
          {({ sourceData, imgHeight }) => {
            return (
              <NoteCard
                id={sourceData.id}
                imgHeight={imgHeight}
                url={sourceData.images[0].url}
                title={sourceData.title ?? ""}
                author={sourceData.user.username}
                avatar={sourceData.user.avatar}
              />
            );
          }}
        </WaterFall>
      </div>
      <div className={style.floatingBtnSets}>
        <div className={style.reload} onClick={handleReload}>
          <SvgIcon name="reload" />
        </div>
      </div>
    </div>
  );
};

export default Index;
