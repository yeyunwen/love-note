import style from "./index.module.scss";

type NoteCardProps = {
  detail: {
    bgColor: string;
    title: string;
    author: string;
    imgHeight: number;
    [key: string]: any;
  };
};

const NoteCard = (props: NoteCardProps) => {
  return (
    <div className={style.noteCardContainer}>
      <div
        className={style.noteCardImg}
        style={{
          height: `${props.detail.imgHeight}px`,
          backgroundColor: props.detail.bgColor,
        }}
      ></div>
      <div className={style.noteCardFooter}>
        <div className={style.title}>{props.detail.title}</div>
        <div className={style.authorWrapper}>
          <div className={style.author}>
            <div className={style.avatar} />
            <span className={style.name}>{props.detail.author}</span>
          </div>
          <div className={style.noteCardInfoRight}>100</div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
