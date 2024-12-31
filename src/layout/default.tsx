import { Outlet } from "react-router-dom";
import style from "./default.module.scss";
import TabBar from "./components/TabBar";
import NavBar from "@/components/Navbar";
import { type RouteMeta, useRouteMeta } from "@/router";
import { useEffect, useState } from "react";

const showNavBar = (meta: RouteMeta | undefined) => {
  if (!meta) return false;
  return meta.showNavBar !== false && meta.customNavBar !== true;
};

const DefaultLayout = () => {
  const meta = useRouteMeta();
  const [shouldShowNavBar, setShouldShowNavBar] = useState(true);

  useEffect(() => {
    setShouldShowNavBar(showNavBar(meta));
  }, [meta]);
  return (
    <section className={`${style.defaultLayout} ${!shouldShowNavBar ? style.noNavBar : ""}`}>
      {/* 根据 meta.showNavBar 判断是否显示 NavBar */}
      {shouldShowNavBar && (
        <div className={style.navBarWrapper}>
          <NavBar title={meta?.title} />
        </div>
      )}
      <main className={style.mainContainer}>
        <Outlet />
      </main>
      <nav className={style.tabBarWrapper}>
        <TabBar />
      </nav>
    </section>
  );
};

export default DefaultLayout;
