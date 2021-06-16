import styled from "styled-components";
import SignIn from "../components/friends-page/SignIn";
import SignUp from "../components/friends-page/SignUp";

const Wrapper = styled.div`
  margin: 0 auto;
  width: 300px;
  padding: 50px 0;
`;

const LogoWrapper = styled.div`
  font-size: 38px;
  font-family: var(--font-family-secondary);
  font-weight: 700;
  color: var(--text-color-link);
  text-align: center;
  margin-bottom: 25px;
  letter-spacing: 0;
  :hover {
    cursor: pointer;
  }
`;

export default function SignInSignUpPage() {
  return (
    <Wrapper>
      <LogoWrapper>intouch</LogoWrapper>
      <SignIn />
      <div style={{ height: "20px" }}></div>
      <SignUp />
    </Wrapper>
  );
}
