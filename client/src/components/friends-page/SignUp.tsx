import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useHttp } from "../../hooks/useHttp";
import styled from "styled-components";
import {
  Button,
  ContentBox,
  ContentBoxContainer,
  Input,
} from "../../styled-components/global";
import Alert from "@material-ui/lab/Alert";
import ButtonSpinner from "../ButtonSpinner";
import { useHistory } from "react-router";

const BoxTitle = styled.div`
  font-family: var(--font-family-secondary);
  font-weight: 700;
  text-align: center;
  margin-bottom: 2px;
  font-size: 18px;
`;

const BoxSubTitle = styled.div`
  color: var(--text-color-secondary);
  text-align: center;
  margin-bottom: 10px;
`;

const SignUp = () => {
  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const { request, error, loading } = useHttp();
  const auth = useContext(AuthContext);
  const history = useHistory();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await request("/api/auth/register", "POST", credentials, {
        Authorization: auth.accessToken,
      });
      auth.login(data.accessToken, data.userData);
      history.push(`/profile/edit/${data.userData._id}`);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ContentBox>
      <ContentBoxContainer>
        <BoxTitle>First time here?</BoxTitle>
        <BoxSubTitle>Let's sign up!</BoxSubTitle>
        {error && <Alert severity="error">{error.message}</Alert>}
        <form onSubmit={handleSubmit}>
          <Input
            value={credentials.firstName}
            onChange={handleChange}
            disabled={loading}
            style={{ marginBottom: "10px" }}
            placeholder="First Name"
            id="firstName"
            name="firstName"
            required
            type="text"
          />
          <Input
            value={credentials.lastName}
            onChange={handleChange}
            disabled={loading}
            style={{ marginBottom: "10px" }}
            placeholder="Last Name"
            id="lastName"
            name="lastName"
            required
            type="text"
          />
          <Input
            value={credentials.email}
            onChange={handleChange}
            disabled={loading}
            style={{ marginBottom: "10px" }}
            placeholder="Email"
            id="email"
            name="email"
            type="email"
            required
          />
          <Input
            value={credentials.password}
            onChange={handleChange}
            disabled={loading}
            placeholder="Password"
            id="password"
            name="password"
            type="password"
            required
            style={{ marginBottom: "10px" }}
          />
          <Button
            size="small"
            type="submit"
            disabled={loading}
            style={{ display: "flex", alignItems: "center" }}
          >
            Sign up {loading && <ButtonSpinner />}
          </Button>
        </form>
      </ContentBoxContainer>
    </ContentBox>
  );
};

export default SignUp;
