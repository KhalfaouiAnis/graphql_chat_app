import React, { useState, useRef, Fragment } from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Card,
  CircularProgress,
  Alert,
} from "@mui/material";

import { useMutation } from "@apollo/client";
import { SIGNUP_USER, SIGNIN_USER } from "../graphql/mutations";

const AuthScreen = ({ setAuthenticated }) => {
  const [formData, setFormData] = useState({});
  const [showLogin, setShowLogin] = useState(true);
  const authFormRef = useRef(null);
  const [
    SignupUser,
    { data: signupData, loading: signupLoading, error: signupError },
  ] = useMutation(SIGNUP_USER);

  const [SigninUser, { _, loading: signinLoading, error: signinError }] =
    useMutation(SIGNIN_USER, {
      onCompleted(data) {
        localStorage.setItem("jwt", data.signinUser.token);
        setAuthenticated(true);
      },
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showLogin) {
      SigninUser({
        variables: {
          userSignin: formData,
        },
      });
    } else {
      SignupUser({
        variables: {
          userNew: formData,
        },
      });
    }
  };

  if (signupLoading || signinLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Box textAlign="center">
          <CircularProgress />
          <Typography variant="h6">Please whait !</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      ref={authFormRef}
      component="form"
      onSubmit={handleSubmit}
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="80vh"
    >
      <Card variant="outlined" sx={{ padding: "10px" }}>
        <Stack direction="column " spacing={2} sx={{ width: "400px" }}>
          {signupData && (
            <Alert severity="success">
              Account for user {signupData.signupUser.firstName} created
              successfully !
            </Alert>
          )}
          {signupError && <Alert severity="error">{signupError.message}</Alert>}
          {signinError && <Alert severity="error">{signinError.message}</Alert>}
          <Typography variant="h5" textAlign="center" color="blue">
            {showLogin ? "Login" : "Signup"}{" "}
          </Typography>
          {!showLogin && (
            <Fragment>
              <TextField
                name="firstName"
                label="First name"
                variant="standard"
                onChange={handleChange}
                required
              />
              <TextField
                name="lastName"
                label="Last name"
                variant="standard"
                onChange={handleChange}
                required
              />
            </Fragment>
          )}
          <TextField
            name="email"
            type="email"
            label="Email"
            variant="standard"
            onChange={handleChange}
            required
          />
          <TextField
            name="password"
            type="password"
            label="Password"
            variant="standard"
            onChange={handleChange}
            required
          />
          <Typography
            className="auth-links"
            textAlign="center"
            style={{ margin: "10px" }}
            variant="subtitle1"
            onClick={() => {
              setShowLogin((prevValue) => !prevValue);
              setFormData({});
              authFormRef.current.reset();
            }}
          >
            {showLogin ? "Signup?" : "Login?"}
          </Typography>
          <Button variant="outlined" type="submit">
            {showLogin ? "Login" : "Create Account"}
          </Button>
        </Stack>
      </Card>
    </Box>
  );
};

export default AuthScreen;
