import { useContext, forwardRef, useCallback, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Layout from "./components/Layout";
import EditProfilePage from "./pages/EditProfilePage";
import FriendsPage from "./pages/FriendsPage";
import MessagesPage from "./pages/MessagesPage";
import SignInSignUpPage from "./pages/SignInSignUpPage";
// import SignUpPage from "./pages/SignUpPage";
import { SnackbarProvider, useSnackbar } from "notistack";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { AuthContext } from "./context/AuthContext";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import ConversationPage from "./pages/ConversationPage";
import { SocketClient } from "./SocketClient";
import CustomNotification from "./components/CustomNotification";
import SignInSignUp from "./pages/SignInSignUpPage";
// import { MessagesContext } from "./context/MessagesContext";

export const useRoutes = (
  isAuthenticated: boolean,
  meUserId: string | undefined,
  ready: boolean
) => {
  // const auth = useContext(AuthContext);

  // console.log("App updated");

  if (!ready) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    // console.log("auth", isAuthenticated);

    // const SnackMessage = (id: any, message: "string") => (
    //   <div>
    //     <div
    //       onClick={() => {
    //         alert(`I belong to snackbar with key ${id}`);
    //       }}
    //     >
    //       'Alert'
    //     </div>
    //   </div>
    // );

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
              {/* <Redirect exact from="/" to={`/profile/${meUserId}`} /> */}
              <Route path="/messages" exact component={MessagesPage} />
              <Route
                path="/conversation/:id"
                exact
                component={ConversationPage}
              />
              <Route path="/friends" component={FriendsPage} />
              <Route
                path="/profile/edit/:id"
                exact
                component={EditProfilePage}
              />
              <Route path={`/profile/:id`} exact component={ProfilePage} />
              <Redirect to={`/profile/${meUserId}`} />
              {/* <Route path="*" component={NotFoundPage} /> */}
            </Switch>
          </MuiPickersUtilsProvider>
        </SnackbarProvider>
      </Layout>
    );
  }

  return (
    <Switch>
      <Redirect exact from="/" to="/signup" />
      {/* <Route path="/signin" exact component={SignInPage} /> */}
      <Route path="/signup" exact component={SignInSignUpPage} />
      <Redirect to="/signup" />
    </Switch>
  );
};
