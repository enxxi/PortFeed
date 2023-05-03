import { useNavigate } from "react-router-dom";
import { Paper, Grid, Button } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import UserFileEditForm from "./UserFileEditForm";

function UserCard({ user, setIsEditing, isEditable, isNetwork, setUser }) {
  const navigate = useNavigate();
  
  let url = "http://" + window.location.hostname + ":5001/profile/" + user?.profile;
  if(!user?.profile) url = "http://placekitten.com/200/199";

  return (
    <div style={{ marginTop: "2rem" }}>
      <Paper sx={{ width: "18rem", mb: 2, ms: 3, mr: 5, p: 2 }}>
        <Grid container>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <img
              style={{ width: "8rem", height: "8rem" }}
              className="mb-3"
              //기존의 고양이 사진만 띄웠는데 유저 로컬 드라이브에 있는 파일로도 나오게끔 설정
              src={url}
              alt="회원 프로필"
            />
          </Grid>
         <UserFileEditForm user={user} isEditable={isEditable} setUser={setUser}/>

          <Grid item xs={12}>
            <Grid container justifyContent="center">
              <Grid item xs={12}>
                <h5>{user?.name}</h5>
              </Grid>
              <Grid item xs={12}>
                <p>{user?.email}</p>
              </Grid>
              <Grid item xs={12}>
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
    </div>
  );
}

export default UserCard;