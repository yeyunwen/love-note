import { NavLink, Outlet } from "react-router-dom";
import style from "./default.module.scss";
import SvgIcon from "@/components/SvgIcon";

const navList = [
  {
    name: "home",
    path: "/",
  },
  {
    name: "add",
    path: "/about",
  },
];

const NavList = () => {
  return navList.map((item) => {
    return (
      <div className={style.listItem} key={item.path}>
        <NavLink
          to={item.path}
          className={({ isActive }) => {
            return isActive ? style.active : "";
          }}
        >
          <SvgIcon name={item.name} />
        </NavLink>
      </div>
    );
  });
};

const DefaultLayout = () => {
  return (
    <section className={style.defaultLayout}>
      <Outlet />
      <nav className={style.navContainer}>
        <div className={style.navList}>
          <NavList />
        </div>
      </nav>
    </section>
  );
};

export default DefaultLayout;
