import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Grid, Select, MenuItem, Button } from "@mui/material";

import * as Api from "../../api";
import UserCard from "./UserCard";
import { UserStateContext } from "../../App";

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
      <div style={{ marginLeft: "2rem" }}>
      <div className="d-flex justify-content-end my-3">
        <label className="me-2">페이지 당 유저 수:</label>
        <Select
          id="perPage"
          value={perPage}
          onChange={(e) => {
            setPerPage(Number(e.target.value));
            setPage(1);
          }}
        >
          <MenuItem value="5">5</MenuItem>
          <MenuItem value="10">10</MenuItem>
          <MenuItem value="29">20</MenuItem>
        </Select>
      </div>
      <Grid container spacing={2} justifyContent="flex-start">
        {users.map((user) => (
          <Grid item key={user.id} xs={12} sm={6} md={4}>
            <UserCard user={user} isNetwork />
          </Grid>
        ))}
      </Grid>
      <div className="d-flex justify-content-center">
        <Button
          variant="contained"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          이전 페이지
        </Button>
        {page} / {totalPage}
        <Button
          variant="contained"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPage}
        >
          다음 페이지
        </Button>
      </div>
      </div>
    </>
  );
}

export default Network;