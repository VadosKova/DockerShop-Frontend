import { createContext, useContext } from "react";
 
 
export 
 
export const AppCtx = createContext({});
export const useApp = () => useContext(AppCtx);