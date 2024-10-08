import { createBrowserRouter, RouteObject } from "react-router-dom";
import Index from "@/pages/index";
import { DefaultLayout } from "../layout";
import Detail from "@/pages/detail";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "/about",
        element: <>about123 </>,
      },
      {
        path: "/detail",
        element: <Detail />,
      },
    ],
  },
];
const router = createBrowserRouter(routes, {
  basename: "/love-note",
});

export default router;
