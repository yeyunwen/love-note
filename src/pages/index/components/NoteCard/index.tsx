import { NavLink } from "react-router-dom";
import style from "./index.module.scss";

type NoteCardProps = {
  detail: {
    title: string;
    author: string;
    imgHeight: number;
    url: string;
    id: number;
  };
};

const NoteCard = (props: NoteCardProps) => {
  return (
    <NavLink
      className={style.noteCardContainer}
      to={`/note/${props.detail.id}`}
    >
      <img
        className={style.noteCardImg}
        src={props.detail.url}
        style={{
          height: `${props.detail.imgHeight}px`,
        }}
      />
      <div className={style.footer}>
        <div className={style.title}>{props.detail.title}</div>
        <div className={style.authorWrapper}>
          <div className={style.author}>
            <div className={style.avatar} />
            <span className={style.name}>{props.detail.author}</span>
          </div>
          <div className={style.likeWrapper}></div>
        </div>
      </div>
    </NavLink>
  );
};

export default NoteCard;
