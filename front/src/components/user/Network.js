import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Grid, Select, MenuItem, Button } from "@mui/material";
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
  const [perPage, setPerPage] = useState(5);
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
      <Stack spacing={2}>
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
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </NativeSelect>
        </div>
        <Grid container spacing={2} justifyContent="flex-start">
          {users.map((user) => (
            <Grid item key={user.id} xs={11} sm={6} md={4}>
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
