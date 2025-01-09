import React, { useRef, useState } from "react";
import { useSprings, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import SvgIcon from "@/components/SvgIcon";
import style from "./index.module.scss";
import { uploadImgsApi, type UploadImgsRes, createNoteApi } from "@/api/new";
import { useNavigate } from "react-router-dom";
import Toast from "@/components/Toast";
import { ImagePreview } from "@/components/ImagePreview";

const New = () => {
  const titleLimit = 20;
  const imgLimit = 9;

  const addImgRef = useRef<HTMLInputElement>(null);
  const [imgs, setImgs] = useState<UploadImgsRes[]>([]);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const navigate = useNavigate();

  const [springs, api] = useSprings(imgs.length, () => ({
    scale: 1,
    zIndex: 0,
    immediate: false,
  }));

  const bind = useDrag(({ args: [originalIndex], active, movement: [x] }) => {
    const currentPosition = originalIndex + Math.round(x / 82);
    const targetIndex = Math.max(0, Math.min(currentPosition, imgs.length - 1));

    api.start((index) => ({
      scale: active && index === originalIndex ? 1.1 : 1,
      zIndex: active && index === originalIndex ? 1 : 0,
      immediate: active,
    }));

    if (!active) {
      const newImgs = [...imgs];
      const [movedItem] = newImgs.splice(originalIndex, 1);
      newImgs.splice(targetIndex, 0, movedItem);
      setImgs(newImgs);

      console.log(
        "New image order:",
        newImgs.map((img) => img.id),
      );
    }
  });

  const clickAddImg = () => {
    addImgRef.current?.click();
  };

  const handleChangeImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (imgs.length >= imgLimit) {
      Toast.show({ message: `最多只能添加${imgLimit}张图片` });
      return;
    }
    const files = e.target.files;
    if (!files) return;
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    const res = await uploadImgsApi(formData);
    setImgs((prev) => [...prev, ...res]);
  };

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleChangeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSubmit = async () => {
    await createNoteApi({
      title,
      content,
      imageIds: imgs.map((img) => img.id),
    });
    Toast.show({ message: "发布成功🎉" });
    navigate("/");
  };

  const clearTitle = () => {
    setTitle("");
  };

  const handlePreview = (index: number) => {
    setPreviewVisible(true);
    setCurrentIndex(index);
  };

  const handleClosePreview = () => {
    setPreviewVisible(false);
  };

  const handleChangePreview = (swiper: import("swiper").Swiper) => {
    setCurrentIndex(swiper.activeIndex);
  };

  const handleSetCover = () => {
    const curImg = imgs[currentIndex];
    const otherImgs = imgs.toSpliced(currentIndex, 1);
    setImgs([curImg, ...otherImgs]);
    setCurrentIndex(0);
  };

  const handleDeleteImg = () => {
    const otherImgs = imgs.toSpliced(currentIndex, 1);
    setImgs(otherImgs);

    if (otherImgs.length === 0) {
      setPreviewVisible(false);
      return;
    }

    setCurrentIndex(Math.min(currentIndex, otherImgs.length - 1));
  };

  return (
    <div className={style.newContainer}>
      <div className={style.imgContainer}>
        {springs.map(({ scale, zIndex }, i) => (
          <animated.div
            key={imgs[i].id}
            className={style.imgItem}
            style={{
              scale,
              zIndex,
              touchAction: "none",
              cursor: "grab",
            }}
            {...bind(i)}
            onClick={() => handlePreview(i)}
          >
            <img src={imgs[i].url} alt={imgs[i].originalname} draggable={false} />
          </animated.div>
        ))}
        <div className={style.addImg} onClick={clickAddImg}>
          <SvgIcon name="addImg" />
          <input
            ref={addImgRef}
            type="file"
            accept="image/*"
            multiple
            name="noteImg"
            style={{ display: "none" }}
            onChange={handleChangeImg}
          />
        </div>
      </div>
      <div className={style.contentContainer}>
        <div className={style.titleWrapper}>
          <input
            className={style.titleInput}
            value={title}
            onChange={handleChangeTitle}
            type="text"
            maxLength={titleLimit}
            placeholder="添加标题"
          />
          {title && (
            <div className={style.clearTitleBtn} onClick={clearTitle}>
              <SvgIcon name="clear" width={18} height={18} />
            </div>
          )}
          <div className={style.limit}>{titleLimit - title.length || 0}</div>
        </div>
        <div className={style.descWrapper}>
          <textarea
            className={style.descInput}
            value={content}
            onChange={handleChangeContent}
            placeholder="添加正文"
          />
        </div>
      </div>
      <div className={style.submitBtnWrapper} onClick={handleSubmit}>
        <button className={style.submitBtn}>发布笔记</button>
      </div>
      <ImagePreview
        visible={previewVisible}
        imageList={imgs.map((img) => img.url)}
        defaultIndex={currentIndex}
        closeIcon={true}
        onClose={handleClosePreview}
        onChange={handleChangePreview}
      >
        <div className={style.operateContainer}>
          {currentIndex !== 0 && (
            <div className={style.operateItem} onClick={handleSetCover}>
              设置为封面
            </div>
          )}
          <div className={style.operateItem} onClick={handleDeleteImg}>
            删除
          </div>
        </div>
      </ImagePreview>
    </div>
  );
};

export default New;
