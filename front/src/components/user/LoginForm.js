import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Grid, TextField, Button, Typography } from "@mui/material";

import * as Api from "../../api";
import { DispatchContext } from "../../App";

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useContext(DispatchContext);

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
      });

      const user = res.data;
      const jwtToken = user.token;
      sessionStorage.setItem("userToken", jwtToken);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: user,
      });

      navigate("/", { replace: true });
    } catch (err) {
      console.log("로그인에 실패하였습니다.\n", err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ mt: 5 }}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center">
            로그인
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="이메일 주소"
              variant="outlined"
              fullWidth
              type="email"
              autoComplete="on"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!isEmailValid}
              helperText={!isEmailValid ? "이메일 형식이 올바르지 않습니다." : ""}
              margin="dense"
            />
            <TextField
              label="비밀번호"
              variant="outlined"
              fullWidth
              type="password"
              autoComplete="on"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!isPasswordValid}
              helperText={!isPasswordValid ? "비밀번호는 4글자 이상입니다." : ""}
              margin="dense"
            />
            <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
              <Grid item>
                <Button variant="contained" color="primary" type="submit" disabled={!isFormValid}>
                  로그인
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" color="inherit" onClick={() => navigate("/register")}>
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
