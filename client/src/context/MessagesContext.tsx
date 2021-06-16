import { createContext, Dispatch } from "react";
import { IUserData } from "../interfaces/IUserData";

export type MessagesContextType = {
  conversations: any;
  setConversations: Dispatch<any>;
};

const noop = (): void => {};

export const MessagesContext = createContext<MessagesContextType>({
  conversations: null,
  setConversations: noop,
});
