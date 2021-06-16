import { createContext, Dispatch } from "react";
import { IUserData } from "../interfaces/IUserData";

export type ConversationContextType = {
  conversation: any;
  setConversation: Dispatch<any>;
};

const noop = (): void => {};

export const ConversationContext = createContext<ConversationContextType>({
  conversation: null,
  setConversation: noop,
});
