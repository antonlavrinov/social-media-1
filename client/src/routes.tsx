import { Switch, Route, Redirect } from "react-router-dom";
import Layout from "./components/Layout";
import EditProfilePage from "./pages/EditProfilePage";
import FriendsPage from "./pages/FriendsPage";
import MessagesPage from "./pages/MessagesPage";
import SignInSignUpPage from "./pages/SignInSignUpPage";

import { SnackbarProvider } from "notistack";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

import ProfilePage from "./pages/ProfilePage";
import ConversationPage from "./pages/ConversationPage";
import { SocketClient } from "./SocketClient";

import styled from "styled-components";
import Spinner from "./components/Spinner";
import SearchPage from "./pages/SearchPage";

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export const useRoutes = (
  isAuthenticated: boolean,
  meUserId: string | undefined,
  ready: boolean
) => {
  if (!ready) {
    return (
      <SpinnerWrapper>
        <Spinner />
      </SpinnerWrapper>
    );
  }

  if (isAuthenticated) {
    return (
      <Layout>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          autoHideDuration={10000}
        >
          <SocketClient />
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Switch>
              <Route path="/messages" exact component={MessagesPage} />
              <Route
                path="/conversation/:id"
                exact
                component={ConversationPage}
              />
              <Route path="/search" component={SearchPage} />
              <Route path="/friends" component={FriendsPage} />
              <Route
                path="/profile/edit/:id"
                exact
                component={EditProfilePage}
              />
              <Route path={`/profile/:id`} exact component={ProfilePage} />
              <Redirect to={`/profile/${meUserId}`} />
            </Switch>
          </MuiPickersUtilsProvider>
        </SnackbarProvider>
      </Layout>
    );
  }

  return (
    <Switch>
      <Redirect exact from="/" to="/signup" />
      <Route path="/signup" exact component={SignInSignUpPage} />
      <Redirect to="/signup" />
    </Switch>
  );
};
