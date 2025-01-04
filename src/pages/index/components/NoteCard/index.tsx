import { NavLink } from "react-router-dom";
import style from "./index.module.scss";

type NoteCardProps = {
  detail: {
    title: string;
    author: string;
    avatar: string;
    imgHeight: number;
    url: string;
    id: number;
  };
};

const getImgHeight = (height: number) => {
  const minHeight = 150;
  return height > minHeight ? height : minHeight;
};

const NoteCard = (props: NoteCardProps) => {
  return (
    <NavLink className={style.noteCardContainer} to={`/note/${props.detail.id}`}>
      <div
        className={style.imgWrapper}
        style={{
          height: `${getImgHeight(props.detail.imgHeight)}px`,
        }}
      >
        <img className={style.noteCardImg} src={props.detail.url} />
      </div>
      <div className={style.footer}>
        <div className={style.title}>{props.detail.title}</div>
        <div className={style.authorWrapper}>
          <div className={style.author}>
            <img className={style.avatar} src={props.detail.avatar} />
            <span className={style.name}>{props.detail.author}</span>
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default NoteCard;
