import React, { useState, useEffect } from "react";
import { useHttp } from "./useHttp";

export const useLoadConversation = (id: string) => {
  const [conversation, setConversation] = useState<any>(null);
  const { request, loading } = useHttp();
  useEffect(() => {
    request(`/api/conversation/${id}`, "GET").then((res) => {
      setConversation(res.conversation);
    });
  }, []);

  return { conversation, setConversation, loading };
};
