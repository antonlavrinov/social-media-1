import React from "react";

const test = () => {
  return (
    <App>
      {authenticated ? (
        <>
          <MyUserDataContext>
            {/* contains my information except posts and friends */}
            <Layout>
              {personal ? (
                <>
                  <ProfilePage>
                    <div></div>
                  </ProfilePage>
                  <FriendsPage>
                    {/* loads friends through api */}
                    {/* loads friend requests through api */}
                  </FriendsPage>
                  <ConversationsPage>
                    {/* loads all conversations with all its messages throught api */}
                  </ConversationsPage>
                  <MessagesPage>
                    {/* it doesn't load from api but finds the right conversation
                through conversations context */}
                  </MessagesPage>
                  <EditProfilePage>
                    {/* which changes our data */}
                  </EditProfilePage>
                </>
              ) : (
                //   not personal loads all user information and populates the page
                <>
                  <ProfilePage></ProfilePage>
                  <FriendsPage>
                    {/* which loads friends from api */}
                  </FriendsPage>
                </>
              )}
            </Layout>
          </MyUserDataContext>
        </>
      ) : (
        <>
          <SignInAndSignUpPage></SignInAndSignUpPage>
          when we create a profile it creates a profile and redirects us to edit
          profile page
        </>
      )}
    </App>
  );
};

export default test;
