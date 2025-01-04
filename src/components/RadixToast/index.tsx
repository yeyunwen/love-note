import React, { createContext, useState, ReactNode, useEffect } from "react";
import * as Toast from "@radix-ui/react-toast";
import emitter from "@/utils/mitt";
import styles from "./index.module.css";
export interface RadixToastContextType {
  showToast: (msg: string) => void;
}

export const RadixToastContext = createContext<RadixToastContextType | undefined>(undefined);

export const RadixToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
    <RadixToastContext.Provider value={{ showToast }}>
      <Toast.Provider swipeDirection="up" duration={3000}>
        {children}
        <Toast.Root className={styles.Root} open={open} onOpenChange={setOpen}>
          <Toast.Title className={styles.Title}>{message}</Toast.Title>
        </Toast.Root>
        <Toast.Viewport className={styles.Viewport} />
      </Toast.Provider>
    </RadixToastContext.Provider>
  );
};

export default {
  show: (message: string) => {
    emitter.emit("showToast", message);
  },
};
