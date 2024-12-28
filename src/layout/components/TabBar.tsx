import { NavLink } from "react-router-dom";
import style from "@/layout/default.module.scss";
import SvgIcon from "@/components/SvgIcon";

const tabBarList = [
  {
    name: "home",
    path: "/",
  },
  {
    name: "new",
    path: "/new",
  },
];

const TabBar = () => {
  return (
    <div className={style.tabBarContainer}>
      {tabBarList.map((item) => {
        return (
          <div className={style.tabBarItem} key={item.path}>
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
      })}
    </div>
  );
};

export default TabBar;
