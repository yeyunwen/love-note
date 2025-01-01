import React, { createContext, useState, ReactNode, useEffect } from "react";
import * as Toast from "@radix-ui/react-toast";
import emitter from "@/utils/mitt";
import styles from "./index.module.css";
export interface ToastContextType {
  showToast: (msg: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const showToast = (msg: string) => {
    setMessage(msg);
    setOpen(true);
  };

  useEffect(() => {
    const handleShowToast = (msg: string) => {
      console.log("handleShowToast", msg);
      showToast(msg);
    };

    emitter.on("showToast", handleShowToast);

    return () => {
      emitter.off("showToast", handleShowToast);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast.Provider swipeDirection="up">
        {children}
        <Toast.Root className={styles.Root} open={open} onOpenChange={setOpen}>
          <Toast.Title className={styles.Title}>{message}</Toast.Title>
        </Toast.Root>
        <Toast.Viewport className={styles.Viewport} />
      </Toast.Provider>
    </ToastContext.Provider>
  );
};
