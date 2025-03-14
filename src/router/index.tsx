import { createBrowserRouter, RouteObject, useLocation, matchPath } from "react-router-dom";
import { DefaultLayout } from "../layout";
import Index from "@/pages/index/index";
// import IndexOld from "@/pages/index/index.old";
import Login from "@/pages/login";
import Detail from "@/pages/detail";
import New from "@/pages/new";
import Me from "@/pages/me";
import WithKeepAlive from "./WithKeepAlive";
// 定义 Meta 类型
export interface RouteMeta {
  title?: string;
  requiresAuth?: boolean;
  showNavBar?: boolean;
  customNavBar?: boolean;
  showTabBar?: boolean;
}

// 扩展 RouteObject 类型
export type CustomRouteObject = RouteObject & {
  meta?: RouteMeta;
  children?: CustomRouteObject[];
};

const routes: CustomRouteObject[] = [
  {
    path: "/login",
    element: <Login />,
    meta: {
      title: "登录",
      showNavBar: false,
      requiresAuth: false,
    },
  },
  {
    path: "/",
    element: <DefaultLayout />,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "/",
        element: (
          <WithKeepAlive name="IndexPage">
            {/* <IndexOld /> */}
            <Index />
          </WithKeepAlive>
        ), // 使用包装后的组件
        meta: {
          title: "首页",
          requiresAuth: true,
          showNavBar: false,
        },
      },
      {
        path: "/new",
        element: <New />,
        meta: {
          title: "新建笔记",
          requiresAuth: true,
          showNavBar: true,
          showTabBar: false,
        },
      },
      {
        path: "/note/:id",
        element: <Detail />,
        meta: {
          title: "笔记详情",
          requiresAuth: true,
          customNavBar: true,
        },
      },
      {
        path: "/me",
        element: (
          <WithKeepAlive name="MePage">
            <Me />
          </WithKeepAlive>
        ),
        meta: {
          title: "我的",
          requiresAuth: true,
          showNavBar: false,
        },
      },
    ],
  },
];

// 创建路由器时的类型断言
const router = createBrowserRouter(routes as RouteObject[], {
  basename: "/",
});

// useRouteMeta hook
export const useRouteMeta = (): RouteMeta | undefined => {
  const location = useLocation();

  const findRoute = (
    routes: CustomRouteObject[],
    pathname: string,
  ): CustomRouteObject | undefined => {
    for (const route of routes) {
      // 跳过布局路由的 meta
      if (route.children) {
        const childRoute = findRoute(route.children, pathname);
        if (childRoute) {
          return childRoute;
        }
      }

      // 使用 matchPath 来匹配路由，包括动态路由
      if (route.path && matchPath(route.path, pathname)) {
        return route;
      }
    }
  };

  const currentRoute = findRoute(routes, location.pathname);
  return currentRoute?.meta;
};

export default router;
