import React, { useState, useCallback, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useHttp = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { accessToken } = useContext(AuthContext);

  const [error, setError] = useState<null | {
    message: string;
    errors?: {
      value?: string;
      msg?: string;
      param?: string;
      location?: string;
    }[];
  }>(null);

  const request = useCallback(
    async (
      url: string,
      method: string = "GET",
      body: any = null,
      headers: any = {}
    ) => {
      setLoading(true);
      try {
        if (body) {
          body = JSON.stringify(body);
          headers["Content-Type"] = "application/json";
        }
        if (!headers["Authorization"]) {
          headers["Authorization"] = `Bearer ${accessToken}`;
        }

        console.log("REQUEST", body);

        const response = await fetch(url, {
          method,
          body,
          headers,
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data);
          throw new Error(data.message || "Что-то пошло не так");
        }

        setLoading(false);
        return data;
      } catch (e) {
        setLoading(false);

        throw e;
      }
    },
    []
  );

  const clearError = useCallback(() => setError(null), []);
  return { loading, request, error, clearError };
};
