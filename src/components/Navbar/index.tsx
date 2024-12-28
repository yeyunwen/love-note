import SvgIcon from "../SvgIcon";
import style from "./index.module.scss";
import { useNavigate } from "react-router-dom";

type NavBarProps = {
  title?: string;
  customLeft?: React.ReactNode;
  customRight?: React.ReactNode;
  onLeftClick?: () => void;
  onRightClick?: () => void;
};
const NavBar: React.FC<NavBarProps> = (props) => {
  const { title, customLeft, customRight, onLeftClick, onRightClick } = props;
  const navigate = useNavigate();

  const leftContent = customLeft ? customLeft : <SvgIcon name="back" />;
  const rightContent = customRight ? customRight : "";

  const handleLeftClick = () => {
    if (onLeftClick) {
      onLeftClick();
    } else {
      navigate(-1);
    }
  };

  const handleRightClick = () => {
    if (onRightClick) {
      onRightClick();
    }
  };

  return (
    <div className={style.navBarContainer}>
      <div className={style.navBarLeft} onClick={handleLeftClick}>
        {leftContent}
      </div>
      {title && <div className={style.navBarCenter}>{title}</div>}
      <div className={style.navBarRight} onClick={handleRightClick}>
        {rightContent}
      </div>
    </div>
  );
};

export default NavBar;
