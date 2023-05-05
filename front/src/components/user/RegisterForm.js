import React, { useContext, useState } from "react";
import { useHistory, useNavigate } from "react-router-dom";
import { Container, Grid, TextField, Button, Typography } from "@mui/material";

import * as Api from "../../lib/apis/api";

import { DispatchContext } from "../../App";
import Swal from "sweetalert2";

function RegisterForm() {
  const dispatch = useContext(DispatchContext);

  const navigate = useNavigate();

  //useState로 email 상태를 생성함.
  const [email, setEmail] = useState("");
  //useState로 password 상태를 생성함.
  const [password, setPassword] = useState("");
  //useState로 confirmPassword 상태를 생성함.
  const [confirmPassword, setConfirmPassword] = useState("");
  //useState로 name 상태를 생성함.
  const [name, setName] = useState("");

  //이메일이 abc@example.com 형태인지 regex를 이용해 확인함.
  const validateEmail = (email) => {
    return email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  //위 validateEmail 함수를 통해 이메일 형태 적합 여부를 확인함.
  const isEmailValid = validateEmail(email);
  // 비밀번호가 4글자 이상인지 여부를 확인함.
  const isPasswordValid = password.length >= 4;
  // 비밀번호와 확인용 비밀번호가 일치하는지 여부를 확인함.
  const isPasswordSame = password === confirmPassword;
  // 이름이 2글자 이상인지 여부를 확인함.
  const isNameValid = name.length >= 2;

  // 위 4개 조건이 모두 동시에 만족되는지 여부를 확인함.
  const isFormValid =
    isEmailValid && isPasswordValid && isPasswordSame && isNameValid;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // "user/register" 엔드포인트로 post요청함.
      await Api.post("user/register", {
        email,
        password,
        name,
      }).catch((err) => {
        console.log(err);
        throw new Error(err.response.data);
      });

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
    <Container sx={{ marginTop: 5 }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <Typography
            variant="h5"
            align="center"
            mb={3}
            sx={{ fontFamily: "GmarketSans" }}
          >
            회원가입
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              id="registerEmail"
              label={
                <span style={{ fontFamily: "GmarketSans" }}>이메일 주소</span>
              }
              type="email"
              fullWidth
              margin="normal"
              sx={{ fontFamily: "GmarketSans" }}
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!isEmailValid && email !== ""}
              helperText={
                !isEmailValid &&
                email !== "" &&
                "이메일 형식이 올바르지 않습니다."
              }
            />

            <TextField
              id="registerPassword"
              sx={{ fontFamily: "GmarketSans" }}
              label={
                <span style={{ fontFamily: "GmarketSans" }}>비밀번호</span>
              }
              type="password"
              fullWidth
              margin="normal"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!isPasswordValid && password !== ""}
              helperText={
                !isPasswordValid &&
                password !== "" &&
                "비밀번호는 4글자 이상으로 설정해 주세요."
              }
            />

            <TextField
              id="registerConfirmPassword"
              type="password"
              fullWidth
              margin="normal"
              label={
                <span style={{ fontFamily: "GmarketSans" }}>
                  비밀번호 재확인
                </span>
              }
              autoComplete="off"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!isPasswordValid && password !== ""}
              helperText={
                !isPasswordSame &&
                confirmPassword !== "" &&
                "비밀번호가 일치하지 않습니다."
              }
            />

            <TextField
              id="registerName"
              label={<span style={{ fontFamily: "GmarketSans" }}>이름</span>}
              type="text"
              fullWidth
              margin="normal"
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!isNameValid && name !== ""}
              helperText={
                !isNameValid &&
                name !== "" &&
                "이름은 2글자 이상으로 설정해 주세요."
              }
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
                  type="submit"
                  sx={{ fontFamily: "GmarketSans" }}
                  disabled={!isFormValid}
                >
                  회원가입
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  sx={{ fontFamily: "GmarketSans" }}
                  color="success"
                  onClick={() => navigate("/login")}
                >
                  로그인하기
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
}

export default RegisterForm;
