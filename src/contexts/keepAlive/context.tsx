import { createContext } from "react";

interface KeepAliveContextType {
  clearCache: () => void;
}

export const KeepAliveContext = createContext<KeepAliveContextType>({
  clearCache: () => {
    console.log("clearCache");
  },
});
