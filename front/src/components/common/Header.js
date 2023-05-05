import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserStateContext, DispatchContext } from "../../App";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

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
        main: "#117864",
      },
      secondary: {
        main: "#ABEBC6",
      },
      typography: {
        fontFamily: "GmarketSans",
      },
    },
  });

  const styles = {
    toolbar: {
      [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        alignItems: "center",
      },
    },
    button: {
      [theme.breakpoints.down("md")]: {
        margin: "10px",
      },
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="sticky" sx={{ marginBottom: "20px" }}>
        <Toolbar style={styles.toolbar}>
          <Typography
            style={{ fontFamily: "GmarketSans" }}
            variant="h6"
            component="div"
            sx={{ mr: "auto" }}
            onClick={() => navigate("/")}
          >
            PortFeed
          </Typography>
          {isLogin && (
            <Button
              color={location.pathname === "/" ? "secondary" : "inherit"}
              onClick={() => navigate("/")}
              style={styles.button}
              sx={{ fontFamily: "GmarketSans" }}
            >
              나의 페이지
            </Button>
          )}
          {isLogin && (
            <Button
              color={location.pathname === "/network" ? "secondary" : "inherit"}
              onClick={() => navigate("/network")}
              style={styles.button}
              sx={{ fontFamily: "GmarketSans" }}
            >
              네트워크
            </Button>
          )}
          {isLogin && (
            <Button
              color="inherit"
              onClick={logout}
              style={styles.button}
              sx={{ fontFamily: "GmarketSans" }}
            >
              로그아웃
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default Header;
