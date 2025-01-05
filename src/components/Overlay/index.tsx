import styles from "./index.module.scss";
import { type BasicComponent, ComponentDefaults } from "@/utils/components";

export interface OverlayProps extends BasicComponent {
  zIndex?: number;
  visible: boolean;
  closeOnOverlayClick?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const defaultOverlayProps: OverlayProps = {
  ...ComponentDefaults,
  visible: false,
  closeOnOverlayClick: true,
  onClick: () => {},
};

export const Overlay: React.FC<OverlayProps> = (props) => {
  const { zIndex, visible, closeOnOverlayClick, children, onClick, className, style } = {
    ...defaultOverlayProps,
    ...props,
  };
  const _style = { zIndex, ...style };

  if (!visible) return null;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick) {
      onClick && onClick(e);
    }
  };

  return (
    <div className={`${styles.overlayContainer} ${className}`} onClick={handleClick} style={_style}>
      {children}
    </div>
  );
};
