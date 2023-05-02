import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserStateContext, DispatchContext } from "../App";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const userState = useContext(UserStateContext);
  const dispatch = useContext(DispatchContext);

  // 전역상태에서 user가 null이 아니라면 로그인 성공 상태임.
  const isLogin = !!userState.user;

  // 로그아웃 클릭 시 실행되는 함수
  const logout = () => {
    // sessionStorage 에 저장했던 JWT 토큰을 삭제함.
    sessionStorage.removeItem("userToken");
    // dispatch 함수를 이용해 로그아웃함.
    dispatch({ type: "LOGOUT" });
    // 기본 페이지로 돌아감.
    navigate("/");
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: '#00bcd4', // 변경하고자 하는 배경색 코드를 입력.
      },
      secondary: {
        main: '#ff0000', // 변경하고자 하는 사용중 글자색상 코드를 입력.
      },
      typography: {
        fontFamily: 'Bauhaus',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" variant="text" sx={{ mr: "auto" }}>
            Rainbow Spark
        </Typography>
        <Button 
          color={location.pathname === "/" ? "secondary" : "inherit"}
          onClick={() => navigate("/")}
        >
          나의 페이지
        </Button>
        <Button
          color={location.pathname === "/network" ? "secondary" : "inherit"}
          onClick={() => navigate("/network")}
        >
          네트워크
        </Button>
        {isLogin && (
          <Button color="inherit" onClick={logout}>
            로그아웃
          </Button>
        )}
      </Toolbar>
    </AppBar>
    </ThemeProvider>
  );
}

export default Header;
