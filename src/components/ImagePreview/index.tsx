import { Swiper, SwiperSlide } from "swiper/react";
import { Popup } from "@/components/Popup";
import styles from "./index.module.scss";
import { useEffect, useState, useRef } from "react";
import SvgIcon from "../SvgIcon";
import { type BasicComponent, ComponentDefaults } from "@/utils/components";

export interface ImagePreviewProps extends BasicComponent {
  visible: boolean;
  imageList: string[];
  defaultIndex?: number;
  closeIcon?: boolean;
  onClose?: () => void;
  onChange?: (swiper: import("swiper").Swiper) => void;
}

const defaultImagePreviewProps: ImagePreviewProps = {
  ...ComponentDefaults,
  visible: false,
  imageList: [],
  defaultIndex: 0,
  closeIcon: false,
  onClose: () => {},
  onChange: () => {},
};

export const ImagePreview: React.FC<ImagePreviewProps> = (props) => {
  const { visible, imageList, defaultIndex, closeIcon, children, onClose, onChange } = {
    ...defaultImagePreviewProps,
    ...props,
  };
  const [innerVisible, setInnerVisible] = useState(visible);
  const [activeIndex, setActiveIndex] = useState(defaultIndex as number);
  const swiperRef = useRef<import("swiper").Swiper | null>(null);

  const close = () => {
    setInnerVisible(false);
    onClose && onClose();
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (closeIcon) return;
    close();
  };

  const handleClickCloseIcon = () => {
    console.log("handleClickCloseIcon");
    close();
  };

  const onSlideChange = (swiper: import("swiper").Swiper) => {
    setActiveIndex(swiper.activeIndex);
    onChange && onChange(swiper);
  };

  useEffect(() => {
    setInnerVisible(visible);
    setActiveIndex(defaultIndex as number);
    if (swiperRef.current) {
      swiperRef.current.slideTo(defaultIndex as number);
    }
  }, [defaultIndex, visible]);

  return (
    <Popup className={styles.imagePreviewContainer} visible={innerVisible} onClick={handleClick}>
      {closeIcon && (
        <div className={styles.closeContainer} onClick={handleClickCloseIcon}>
          <SvgIcon name="close" />
        </div>
      )}
      <div className={styles.paginationContainer}>
        <div className={styles.pagination}>
          {activeIndex + 1}/{imageList.length}
        </div>
      </div>
      <Swiper
        className={styles.swiperContainer}
        slidesPerView={1}
        initialSlide={activeIndex}
        onSlideChange={onSlideChange}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
      >
        {imageList.map((image) => (
          <SwiperSlide key={image}>
            <div className={styles.imgContainer}>
              <img src={image} alt="image" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {children}
    </Popup>
  );
};
