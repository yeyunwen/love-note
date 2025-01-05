import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { getNoteDetailApi, Note } from "@/api/note";
import { formatSpecialDate } from "@/utils/formatSpecialDate";
import NavBar from "@/components/Navbar";
import SvgIcon from "@/components/SvgIcon";
import { ImagePreview } from "@/components/ImagePreview";

import "swiper/css";
import style from "./index.module.scss";

const Detail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(false);

  const onSlideChange = (swiper: import("swiper").Swiper) => {
    setActiveIndex(swiper.activeIndex);
  };

  useEffect(() => {
    getNoteDetailApi(Number(id)).then((res) => {
      setNote(res);
    });
  }, [id]);

  return (
    <div className={style.detailContainer}>
      <NavBar
        customLeft={
          <div
            className={style.authorContainer}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
            }}
          >
            <div
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                e.stopPropagation();
                navigate(-1);
              }}
            >
              <SvgIcon name="back" />
            </div>
            <div className={style.authorAvatar}>
              <img src={note?.user.avatar} alt="" />
            </div>
            <div className={style.authorName}>{note?.user.username}</div>
          </div>
        }
      />
      <div className={style.mediaContainer} onClick={() => setPreviewVisible(true)}>
        <Swiper className={style.swiperContainer} slidesPerView={1} onSlideChange={onSlideChange}>
          {note?.images.map((image) => (
            <SwiperSlide key={image.id}>
              <div className={style.imgContainer}>
                <img src={image.url} alt="" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className={style.paginationContainer}>
        <div className={style.paginationList}>
          {note?.images.map((image, index) => (
            <div className={style.paginationItem} key={image.id}>
              <span
                className={`${style.paginationItemDot} ${
                  activeIndex === index ? style.activeDot : ""
                }`}
              ></span>
            </div>
          ))}
        </div>
      </div>
      <div className={style.contentContainer}>
        <div className={style.contentTitle}>{note?.title}</div>
        <div className={style.contentDesc}>{note?.content}</div>
        <div className={style.bottomContainer}>
          <div className={style.date}>编辑于 {formatSpecialDate(note?.updatedTime)}</div>
        </div>
      </div>
      <ImagePreview
        visible={previewVisible}
        defaultIndex={activeIndex}
        imageList={note?.images.map((image) => image.url) || []}
        onClose={() => setPreviewVisible(false)}
      />
    </div>
  );
};

export default Detail;
