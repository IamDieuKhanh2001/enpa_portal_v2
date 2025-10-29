"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface HeaderContextProps {
  title: string;
  setTitle: (title: string) => void;
}

const HeaderContext = createContext<HeaderContextProps | undefined>(undefined);

export const HeaderProvider = ({ children }: { children: ReactNode }) => {
  const [title, setTitle] = useState("");

  return (
    <HeaderContext.Provider value={{ title, setTitle }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) throw new Error("useHeader must be used within HeaderProvider");
  return context;
};