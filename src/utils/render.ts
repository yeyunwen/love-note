import { createRoot } from "react-dom/client";

export const render = (element: React.ReactNode, container: HTMLElement) => {
  const root = createRoot(container);
  root.render(element);
};
