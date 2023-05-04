import { useNavigate } from "react-router-dom";
import { Paper, Grid, Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Delete, Edit } from "@mui/icons-material";
import UserFileEditForm from "./UserFileEditForm";

function UserCard({ user, setIsEditing, isEditable, isNetwork, setUser }) {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("http://placekitten.com/200/200");
  useEffect(() => {
    console.log("none");
    if (user?.profile) {
      /*    Api.get(user?.profileImage.path).then((res) => {
      setImageUrl(URL.createObjectURL(res.data));
    }) */
      axios
        .get(
          "http://" +
            window.location.hostname +
            ":5001/profile/" +
            user?.profile,
          {
            responseType: "blob", // blob 데이터로 받기 위해 responseType 설정
          }
        )
        .then((res) => {
          const imageUrl = URL.createObjectURL(res.data); // Blob 데이터를 가리키는 URL 생성
          console.log(imageUrl);
          setImageUrl(imageUrl);
        })
        .catch((error) => console.error(error));
    }
  }, [user?.profile]);

  // let url = "http://" + window.location.hostname + ":5001/profile/" + user?.profile;
  // if(!user?.profile) url = "http://placekitten.com/200/199";

  return (
    <div style={{ marginTop: "2rem" }}>
      <Paper
        sx={{
          border: "3px solid #117864",
          borderRadius: "20px",
          width: "19rem",
          mb: 2,
          ms: 3,
          mr: 5,
          p: 2,
        }}
      >
        <Grid container sx={{ justifyContent: "center", alignItems: "center" }}>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <img
              style={{ width: "8rem", height: "8rem" }}
              className="mb-3"
              //기존의 고양이 사진만 띄웠는데 유저 로컬 드라이브에 있는 파일로도 나오게끔 설정
              src={imageUrl}
              alt="회원 프로필"
            />
          </Grid>
          <UserFileEditForm
            user={user}
            isEditable={isEditable}
            setUser={setUser}
          />
          <Grid item xs={12}>
            <Grid container justifyContent="center">
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <h2>{user?.name}</h2>
              </Grid>
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <p>{user?.email}</p>
              </Grid>
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <p>{user?.description}</p>
              </Grid>
              {isEditable && (
                <Grid item xs={12}>
                  <Grid container justifyContent="center">
                    <Grid item xs={12} sm={6}>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<Edit />}
                        onClick={() => setIsEditing(true)}
                        fullWidth
                      >
                        편집
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              )}
              {isNetwork && (
                <Grid item xs={12}>
                  <Grid container justifyContent="center">
                    <Grid item xs={12} sm={6}>
                      <Button
                        variant="text"
                        onClick={() => navigate(`/users/${user.id}`)}
                        fullWidth
                      >
                        포트폴리오
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <style>
        {`
          @media (max-width: 600px) {
            .MuiPaper-root {
              width: 100%;
              margin-left: 0;
              margin-right: 0;
            }
          }
        `}
      </style>
    </div>
  );
}

export default UserCard;
