import { useLocalObservable } from "mobx-react";
import React, { createContext, useContext } from "react";
import { Store, StoreImp } from "./Store";

const StoreContext = createContext(Store);

export default function StoreContextProvider({ children }: any) {
  const myStore = useLocalObservable(() => Store);
  return (
    <StoreContext.Provider value={myStore}>{children}</StoreContext.Provider>
  );
}

export const StoreData = () => useContext(StoreContext);
