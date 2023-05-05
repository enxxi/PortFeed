import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import * as Api from "../../lib/apis/api";
import UserCard from "./UserCard";
import { UserStateContext } from "../../App";
import NativeSelect from "@mui/material/NativeSelect";

function Network() {
  const navigate = useNavigate();
  const userState = useContext(UserStateContext);
  const [users, setUsers] = useState([]);

  ///pagination////
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8);
  const [totalPage, setTotalPage] = useState(1);
  /////////////////

  useEffect(() => {
    if (!userState.user) {
      navigate("/login");
      return;
    }
    // "userlist" 엔드포인트로 GET 요청을 하고, users를 response의 data로 세팅함.
    Api.get(`userlist?page=${page}&perPage=${perPage}`).then((res) => {
      setUsers(res.data.posts);
      setTotalPage(res.data.totalPage);
    });
  }, [userState.user, navigate, page, perPage]);

  return (
    <>
      <Stack spacing={2} sx={{ overflowX: "hidden", overflowY: "auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "1rem",
          }}
        >
          <label style={{ marginTop: "0.4rem", marginRight: "1rem" }}>
            페이지 당 유저 수:
          </label>
          <NativeSelect
            style={{ marginRight: "1rem" }}
            id="perPage"
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value="8">8</option>
            <option value="16">16</option>
            <option value="24">24</option>
          </NativeSelect>
        </div>
        <Grid container spacing={2} justifyContent="center" padding="0px 50px">
          {users.map((user) => (
            <Grid
              item
              key={user.id}
              lg={3}
              md={4}
              sm={6}
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <UserCard user={user} isNetwork />
            </Grid>
          ))}
        </Grid>
        <div
          className="d-flex justify-content-center"
          style={{ marginBottom: "2rem" }}
        >
          <Pagination
            count={totalPage}
            page={page}
            renderItem={(item) => (
              <PaginationItem
                slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                {...item}
              />
            )}
            onChange={(event, value) => {
              setPage(value);
              window.scrollTo(0, 0);
            }}
          />
        </div>
      </Stack>
      <style>
        {`@media only screen and (max-width: 960px) {
  .user-card {
    width: 100%;
  }
  .user-card img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
}`}
      </style>
    </>
  );
}

export default Network;
