import { useState } from "react";
import "./App.css";

import { BrowserRouter as Router } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { useRoutes } from "./routes";

import { useAuth } from "./hooks/useAuth";

import { GlobalStyle } from "./styled-components/global";

import { OnlineContext } from "./context/OnlineContext";
import ScrollToTop from "./ScrollToTop";

function App() {
  const {
    login,
    logout,
    accessToken,
    meUserData,
    setMeUserData,
    ready,
    socket,
    notifications,
    setNotifications,
    conversations,
    setConversations,
  } = useAuth();

  const [online, setOnline] = useState<any[]>([]);

  const isAuthenticated = !!accessToken;

  const routes = useRoutes(isAuthenticated, meUserData?._id, ready);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        meUserData,
        setMeUserData,
        isAuthenticated: isAuthenticated,
        login,
        logout,
        socket,
        notifications,
        setNotifications,
        conversations,
        setConversations,
      }}
    >
      <OnlineContext.Provider value={{ online, setOnline }}>
        <GlobalStyle />

        <Router>
          <ScrollToTop />
          {routes}
        </Router>
      </OnlineContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
