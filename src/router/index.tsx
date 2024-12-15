import { createBrowserRouter, RouteObject } from "react-router-dom";
import { DefaultLayout } from "../layout";
import Index from "@/pages/index";
import Login from "@/pages/login";
import Detail from "@/pages/detail";
import New from "@/pages/new";

const routes: RouteObject[] = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "/new",
        element: <New />,
      },
      {
        path: "/detail",
        element: <Detail />,
      },
    ],
  },
];
const router = createBrowserRouter(routes, {
  basename: "/",
});

export default router;
