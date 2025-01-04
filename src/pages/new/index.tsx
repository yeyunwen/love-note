import SvgIcon from "@/components/SvgIcon";
import style from "./index.module.scss";
import { useRef, useState } from "react";
import { uploadImgsApi, type UploadImgsRes, createNoteApi } from "@/api/new";
import { useNavigate } from "react-router-dom";
import Toast from "@/components/Toast";

const New = () => {
  const titleLimit = 20;
  const imgLimit = 9;

  const addImgRef = useRef<HTMLInputElement>(null);
  const [imgs, setImgs] = useState<UploadImgsRes[]>([]);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const navigate = useNavigate();

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

  return (
    <div className={style.newContainer}>
      <div className={style.imgContainer}>
        {imgs.map((img) => (
          <div key={img.id} className={style.imgItem}>
            <img src={img.url} alt={img.originalname} />
          </div>
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
    </div>
  );
};

export default New;
