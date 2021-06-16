import { Dispatch } from "react";
import { createContext } from "react";
import { IUserData } from "../interfaces/IUserData";

export type AuthContextType = {
  accessToken: null | string;
  meUserData: null | IUserData;
  isAuthenticated: boolean;
  login: (jwtToken: string, data: IUserData) => void;
  logout: () => void;
  setMeUserData: Dispatch<any>;
  socket: null | any;
  notifications: any;
  setNotifications: Dispatch<any>;
  conversations: any;
  setConversations: Dispatch<any>;

  // loading: boolean;
};

const noop = (): void => {};

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  meUserData: null,
  setMeUserData: noop,
  isAuthenticated: false,
  login: noop,
  logout: noop,
  socket: null,
  notifications: [],
  setNotifications: noop,
  conversations: null,
  setConversations: noop,

  // loading: false,
});
