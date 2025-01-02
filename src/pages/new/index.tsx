import SvgIcon from "@/components/SvgIcon";
import style from "./index.module.scss";
import { useRef, useState } from "react";
import { uploadImgsApi, type UploadImgsRes, createNoteApi } from "@/api/new";
import { useNavigate } from "react-router-dom";

const New = () => {
  const addImgRef = useRef<HTMLInputElement>(null);
  const [imgs, setImgs] = useState<UploadImgsRes[]>([]);
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const navigate = useNavigate();

  const clickAddImg = () => {
    addImgRef.current?.click();
  };
  const handleChangeImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (imgs.length >= 9) return;
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

  const handleChangeDesc = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDesc(e.target.value);
  };

  const handleSubmit = async () => {
    await createNoteApi({
      title,
      content: desc,
      imageIds: imgs.map((img) => img.id),
    });
    navigate("/");
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
            placeholder="添加标题"
          />
        </div>
        <div className={style.descWrapper}>
          <textarea
            className={style.descInput}
            value={desc}
            onChange={handleChangeDesc}
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
