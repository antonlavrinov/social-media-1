import { createContext, Dispatch } from "react";
// import { IUserData } from "../interfaces/IUserData";

export type OnlineContextType = {
  online: any[];
  setOnline: Dispatch<any>;
};

const noop = (): void => {};

export const OnlineContext = createContext<OnlineContextType>({
  online: [],
  setOnline: noop,
});
