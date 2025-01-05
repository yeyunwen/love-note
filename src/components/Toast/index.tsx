import { useEffect, memo } from "react";
import { render } from "@/utils/render";
import styles from "./index.module.scss";

interface ToastProps {
  /**
   * 元素id
   */
  id?: string;
  /**
   * 消息内容
   */
  message: string;
  /**
   * 持续时间，单位：毫秒
   * @default 2000
   */
  duration?: number;
}

export const Toast: React.FC<ToastProps> = memo(({ message, duration = 2000, id }) => {
  const clearToast = () => {
    if (id) {
      const element = document.getElementById(id);
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }
  };

  const startCloseTimer = () => {
    setTimeout(() => {
      clearToast();
    }, duration);
  };

  useEffect(() => {
    startCloseTimer();
  }, []);

  return (
    <div className={styles.toastContainer}>
      <div className={styles.toastContent}>
        <div className={styles.toastMessage}>{message}</div>
      </div>
    </div>
  );
});

/**
 * 灵感来自 NutUI
 * idea from NutUI
 * https://github.com/jdf2e/nutui-react/blob/next/src/packages/toast/toast.tsx
 */
export default {
  show: (toastProps: ToastProps) => {
    const element = document.createElement("div");
    const id = toastProps.id || `${new Date().getTime()}`;
    element.id = id;
    toastProps.id = id;

    document.body.appendChild(element);

    render(<Toast {...toastProps} />, element);
  },
};
