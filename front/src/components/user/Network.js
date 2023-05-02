import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row } from "react-bootstrap";

import * as Api from "../../api";
import UserCard from "./UserCard";
import { UserStateContext } from "../../App";

function Network() {
  const navigate = useNavigate();
  const userState = useContext(UserStateContext);
  // useState 훅을 통해 users 상태를 생성함.
  const [users, setUsers] = useState([]);

  ///pagination////
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [totalPage, setTotalPage] = useState(1);
  /////////////////

  useEffect(() => {
    // 만약 전역 상태의 user가 null이라면, 로그인 페이지로 이동함.
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
      <div className="d-flex justify-content-end my-3">
        <label className="me-2">페이지 당 유저 수:</label>
        <select
          id="perPage"
          value={perPage}
          onChange={(e) => {
            setPerPage(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="29">20</option>
        </select>
      </div>
      <Row>
        {users.map((user) => (
          <UserCard key={user.id} user={user} isNetwork />
        ))}
      </Row>
      <div className="d-flex justify-content-center">
        <button
          className="btn btn-primary"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          이전 페이지
        </button>
        {page} / {totalPage}
        <button
          className="btn btn-primary"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPage}
        >
          다음 페이지
        </button>
      </div>
    </>
  );
}

export default Network;