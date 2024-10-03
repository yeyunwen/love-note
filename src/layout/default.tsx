import { Outlet } from "react-router-dom";
import style from "./default.module.scss";
import SvgIcon from "@/components/SvgIcon";

const DefaultLayout = () => {
  return (
    <section className={style.defaultLayout}>
      <Outlet />
      <nav className={style.navContainer}>
        <div className={style.navList}>
          <div className={style.listItem}>
            <SvgIcon name="home" />
          </div>
        </div>
      </nav>
    </section>
  );
};

export default DefaultLayout;
