import { NavLink } from "react-router-dom";
import style from "./index.module.scss";

type NoteCardProps = {
  title?: string;
  author: string;
  avatar: string;
  imgHeight: number;
  url: string;
  id: number;
};

const getImgHeight = (height: number) => {
  const MIN_HEIGHT = 150;
  const MAX_HEIGHT = 300;

  return Math.min(Math.max(height, MIN_HEIGHT), MAX_HEIGHT);
};

const NoteCard = (props: NoteCardProps) => {
  return (
    <NavLink className={style.noteCardContainer} to={`/note/${props.id}`}>
      <div
        className={style.imgWrapper}
        style={{
          height: `${getImgHeight(props.imgHeight)}px`,
        }}
      >
        <img className={style.noteCardImg} src={props.url} />
      </div>
      <div className={style.footer}>
        <div className={style.title}>{props.title}</div>
        <div className={style.authorWrapper}>
          <div className={style.author}>
            <img className={style.avatar} src={props.avatar} />
            <span className={style.name}>{props.author}</span>
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default NoteCard;
