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

const BoxTitle = styled.div`
  font-family: var(--font-family-secondary);
  font-weight: 700;
  text-align: center;
  margin-bottom: 10px;
  font-size: 18px;
`;

const SignIn = () => {
  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });

  const { request, error, loading } = useHttp();
  const auth = useContext(AuthContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("CREDENTIALS", credentials);
    try {
      const data = await request("/api/auth/login", "POST", credentials, {
        Authorization: auth.accessToken,
      });

      auth.login(data.accessToken, data.userData);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ContentBox>
      <ContentBoxContainer>
        <BoxTitle>Sign in</BoxTitle>
        {error && (
          <Alert severity="error" style={{ marginBottom: "10px" }}>
            {error.message}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
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
            required
            type="password"
            style={{ marginBottom: "10px" }}
          />
          <Button
            size="small"
            type="submit"
            disabled={loading}
            style={{ display: "flex", alignItems: "center" }}
          >
            Sign in {loading && <ButtonSpinner />}
          </Button>
        </form>
      </ContentBoxContainer>
    </ContentBox>
  );
};

export default SignIn;
