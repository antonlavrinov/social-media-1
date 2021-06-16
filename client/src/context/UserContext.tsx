import { createContext, Dispatch } from "react";
import { IUserData } from "../interfaces/IUserData";

export type UserContextType = {
  userData: IUserData | null;
  setUserData: Dispatch<any>;
  isPersonal: boolean;
};

const noop = (): void => {};

export const UserContext = createContext<UserContextType>({
  userData: null,
  setUserData: noop,
  isPersonal: true,
});
