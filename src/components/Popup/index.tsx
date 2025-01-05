import { ComponentDefaults } from "@/utils/components";
import styles from "./index.module.scss";
import { Overlay, type OverlayProps } from "@/components/Overlay";
import { useEffect, useState } from "react";

interface PopupProps extends OverlayProps {
  visible: boolean;
  /**
   * 是否显示遮罩层
   * @default true
   */
  overlay?: boolean;
  zIndex?: number;
  children?: React.ReactNode;
  onOverlayClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const defaultPopupProps: PopupProps = {
  ...ComponentDefaults,
  visible: false,
  overlay: true,
  closeOnOverlayClick: true,
  onOverlayClick: () => true,
  onClick: () => {},
};

export const Popup: React.FC<PopupProps> = (props) => {
  const {
    visible,
    overlay,
    zIndex,
    children,
    closeOnOverlayClick,
    className,
    onOverlayClick,
    onClick,
    style,
  } = {
    ...defaultPopupProps,
    ...props,
  };
  const _style = { zIndex, ...style };

  const [innerVisible, setInnerVisible] = useState(visible);

  const close = () => {
    setInnerVisible(false);
  };

  // 点击遮罩层 默认关闭 Popup
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (closeOnOverlayClick) {
      const closed = onOverlayClick && onOverlayClick(e);
      closed && close();
    }
  };

  // 点击 Popup 内容
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onClick && onClick(e);
  };

  useEffect(() => {
    setInnerVisible(visible);
  }, [visible]);

  return (
    <>
      {overlay ? <Overlay visible={innerVisible} onClick={handleOverlayClick} /> : null}
      {innerVisible && (
        <div
          className={`${styles.popupContainer} ${className}`}
          style={_style}
          onClick={handleClick}
        >
          {children}
        </div>
      )}
    </>
  );
};
