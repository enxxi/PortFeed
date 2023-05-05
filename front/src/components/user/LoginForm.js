import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import * as Api from "../../lib/apis/api";
import { DispatchContext } from "../../App";

import Swal from "sweetalert2";

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useContext(DispatchContext);

  const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateEmail = (email) => {
    return email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 4;
  const isFormValid = isEmailValid && isPasswordValid;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await Api.post("user/login", {
        email,
        password,
      }).catch((err) => {
        throw new Error(err.response.data);
      });
      const user = res.data;

      const jwtToken = user.token;
      sessionStorage.setItem("userToken", jwtToken);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: user,
      });

      await Swal.fire({
        icon: "success",
        title: `Hello, ${user.name}님!`,
        showConfirmButton: false,
        timer: 1000,
      });

      navigate("/", { replace: true });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err.message,
        showConfirmButton: false,
        timer: 1000,
      });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Grid
  container
  spacing={2}
  direction="column"
  alignItems="center"
  sx={{
    marginTop: 8,
    backgroundColor: "#7FCFAC",
    padding: 2,
    borderRadius: 2,
    fontFamily: "Elice Digital Baeum",
  }}
>
  <Grid item>
    <Avatar
      src="/logos.png"
      variant="square"
      alt="logo"
      sx={{ width: 100, height: 100, mb: 0 }}
    />
  </Grid>
  <Grid item>
    <Typography
      sx={{
        fontFamily: "Elice Digital Baeum",
        fontSize: "22px",
        fontWeight: 600,
      }}
    >
            로그인
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <form onSubmit={handleSubmit}>
            <TextField
              label={
                <span style={{ fontFamily: "GmarketSans" }}>이메일 주소</span>
              }
              variant="outlined"
              sx={{ width: "60%" }}
              type="email"
              autoComplete="on"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!isEmailValid && email !== ""}
              helperText={
                !isEmailValid && email !== ""
                  ? "이메일 형식이 올바르지 않습니다."
                  : ""
              }
              margin="dense"
            />
            <TextField
              label={
                <span style={{ fontFamily: "GmarketSans" }}>비밀번호</span>
              }
              variant="outlined"
              sx={{ width: "60%" }}
              fullWidth
              type="password"
              autoComplete="on"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!isPasswordValid && password !== ""}
              helperText={
                !isPasswordValid && password !== ""
                  ? "비밀번호는 4글자 이상입니다."
                  : ""
              }
              margin="dense"
            />
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
              sx={{ mt: 3 }}
            >
              <Grid item>
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  type="submit"
                  name="GUEST"
                  disabled={!isFormValid}
                  sx={{ fontFamily: "GmarketSans" }}
                  
                >
                  로그인
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="success"
                  name="GUEST"
                  fullWidt
                  onClick={() => navigate("/register")}
                  sx={{ fontFamily: "GmarketSans" }}
                  
                >
                  회원가입하기
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
}

export default LoginForm;
