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

const Wrapper = styled.div``;

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

  // const [errorMessage, setErrorMessage] = useState(null);

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
    try {
      // console.log(credentials);
      const data = await request(
        "http://localhost:5000/api/auth/login",
        "POST",
        credentials,
        { Authorization: auth.accessToken }
      );

      auth.login(data.accessToken, data.userData);
    } catch (e) {
      console.log(e);
    }
  };

  // const classes = useStyles();

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
            // paddingLeft:
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
          <Button size="small" type="submit" disabled={loading}>
            Sign in
          </Button>
        </form>
      </ContentBoxContainer>
    </ContentBox>
  );
};

export default SignIn;
