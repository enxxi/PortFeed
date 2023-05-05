import React, { useState, useEffect, useContext, useMemo } from "react";
import { UserStateContext } from "../../App";
import * as Api from "../../lib/apis/api";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Container,
  Divider,
  Grid,
  IconButton,
  Input,
  Paper,
  Typography,
  TextField,
} from "@mui/material";

import { Delete, Edit } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

export function Project({ isEditable }) {
  //user정보 불러오기/
  const params = useParams();
  const { user } = useContext(UserStateContext);
  const user_id = useMemo(() => {
    return isEditable ? user?.id : params?.userId;
  }, [isEditable, user, params]);

  const [project, setProject] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [projectLoaded, setProjectLoaded] = useState(false);

  // 추가 시 input 값 state 선언
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  // 수정중인지 상태값 선언
  const [editingIndex, setEditingIndex] = useState({ idx: -1, id: "" });

  // input 값 validation
  const isFormValid = title.replaceAll(" ", "") && date.replaceAll(" ", "");
  console.log(project);
  // init component
  useEffect(() => {
    // api 호출
    Api.get(`project/${user_id}/0`)
      .then((res) => {
        setProject(res.data);
        setProjectLoaded(true);
      })
      .catch((err) => console.log(err));
    // 그 결과를 배열 컴포넌트에 뿌려줌
  }, [user_id]);

  // 추가
  const addProject = async () => {
    setTitle("");
    setDate("");
    setDescription("");
    try {
      const result = await Api.post(`project/${user_id}/0`, {
        title,
        date,
        description,
      }).catch((err) => {
        throw new Error(err.response.data.error);
      });

      const project_id = result.data.project_id;

      // 상태값 갱신하며 컴포넌트를 재렌더링
      setProject((project) => {
        const newProject = [...project];
        newProject.push({ title, date, description, project_id });
        return newProject;
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err.message,
        showConfirmButton: false,
        timer: 1000,
      });
    }
  };

  // 편집버튼클릭
  const handleEditClick = async (idx, project_id) => {
    setEditingIndex((item) => {
      const newEditingIndex = { ...item };
      newEditingIndex.idx = idx;
      newEditingIndex.id = project_id;
      return newEditingIndex;
    });
    setTitle(project[idx].title);
    setDate(project[idx].date);
    setDescription(project[idx].description);
  };

  // 편집
  const editProject = async () => {
    try {
      const result = await Api.patch(`project/${user_id}/${editingIndex.id}`, {
        title,
        date,
        description,
      }).catch((err) => {
        throw new Error(err.response.data.error);
      });

      setProject((prevProject) => {
        const newProject = [...prevProject];
        newProject[editingIndex.idx] = result.data;
        return newProject;
      });
      setEditingIndex((item) => {
        const newEditingIndex = { ...item };
        newEditingIndex.idx = -1;
        newEditingIndex.id = "";
        return newEditingIndex;
      });
      setIsCreating(false);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err.message,
        showConfirmButton: false,
        timer: 1000,
      });
    }
  };

  // 삭제
  const removeProject = async (idx, id) => {
    Swal.fire({
      icon:"error",
      text: "삭제 하시겠습니까?",
      showCancelButton: true,
      allowOutsideClick: false,
    }).then(async function (result) {
      if (result.isConfirmed) {
        try {
          await Api.delete(`project/${user_id}/${id}`, "").catch((err) => {
            throw new Error(err.response.data.error);
          });
  
          // 상태값 갱신하며 컴포넌트를 재렌더링
          setProject((project) => {
            const newProject = [...project];
            newProject.splice(idx, 1);
            return newProject;
          });
          setTitle("");
          setDate("");
          setDescription("");
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: err.message,
            showConfirmButton: false,
            timer: 1000,
          });
        }
      } else {
        return;
      } 
    });
  };

  // +버튼 클릭
  const handlePlusClick = () => {
    setIsCreating(!isCreating);
    setTitle("");
    setDate("");
    setDescription("");
  };

  // 취소버튼 클릭
  const handleCancleClick = () => {
    setTitle("");
    setDate("");
    setDescription("");
    setIsCreating(!isCreating);
    setEditingIndex((item) => {
      const newEditingIndex = { ...item };
      newEditingIndex.idx = -1;
      newEditingIndex.id = "";
      return newEditingIndex;
    });
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                style={{ color: "#117864" }}
                variant="h4"
                sx={{ fontFamily: "GmarketSans" }}
              >
                프로젝트
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} style={{ backgroundColor: "#F0F0F0" }}>
            <Paper>
              {!projectLoaded ? (
                <Grid item xs={12}>
                  <Paper>
                    <Box
                      padding={2}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    ></Box>
                  </Paper>
                </Grid>
              ) : project.length > 0 ? (
                project.map((item, idx) => (
                  <Box
                    padding={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    key={idx}
                    sx={{textAlign: 'left'}}
                  >
                    <Box sx={{ backgroundColor: "#f0f0f0", padding: "1rem" }}>
                      <Typography
                        sx={{ width: "auto", fontFamily: "GmarketSans" }}
                        variant="span"
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        sx={{ p: 2, width: "auto", fontFamily: "GmarketSans" }}
                        variant="span"
                      >
                        {item.date}
                      </Typography>
                      {item.description && (
                        <Typography
                          display="flex"
                          sx={{
                            pl: 0,
                            fontFamily: "GmarketSans",
                            color: "#6E6E6E",
                            whiteSpace: "pre-wrap",
                          }}
                          variant="span"
                        >
                          {item.description}
                        </Typography>
                      )}
                    </Box>
                    {isEditable && (
                      <Box>
                        <IconButton
                          color="inherit"
                          aria-label="edit"
                          onClick={() => {
                            handleEditClick(idx, item.project_id);
                            setIsCreating(true);
                          }}
                        >
                          <BorderColorIcon
                            sx={{ width: "24px", height: "24px" }}
                          />
                        </IconButton>
                        <IconButton
                          variant="outlined"
                          onClick={() => removeProject(idx, item.project_id)}
                          color="error"
                          aria-label="delete"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                ))
              ) : (
                <Grid item xs={12}>
                  <Paper>
                    <Box
                      padding={2}
                      display="flex"
                      sx={{ fontFamily: "GmarketSans" }}
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      이력이 없습니다.
                    </Box>
                  </Paper>
                </Grid>
              )}
            </Paper>
          </Grid>
        </Grid>

        {isEditable && !isCreating && (
          <Box marginTop={2}>
            <IconButton
              style={{ color: "#117864" }}
              aria-label="add-award"
              onClick={handlePlusClick}
            >
              <AddCircleRoundedIcon sx={{ width: "38px", height: "38px" }} />
            </IconButton>
          </Box>
        )}

        {isCreating && (
          <Paper
            sx={{
              border: "2px #112222",
              borderRadius: "5px",
              width: "auto",
              mt: 2,
              mb: 2,
              ms: 3,
              ml: 3,
              mr: 3,
              p: 2,
              textAlign: "center",
            }}
          >
            <Grid sx={{ margin: 0 }}>
              <TextField
                sx={{
                  m: 2,
                  width: "auto",
                  "& input": {
                    fontFamily: "GmarketSans",
                  },
                }}
                required
                id="outlined-required"
                label={
                  <span style={{ fontFamily: "GmarketSans" }}>프로젝트명</span>
                }
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                sx={{
                  m: 2,
                  width: "auto",
                  "& input": {
                    fontFamily: "GmarketSans",
                  },
                  "&::placeholder": {
                    fontFamily: "GmarketSans",
                  },
                }}
                required
                label={<span style={{ fontFamily: "GmarketSans" }}>기간</span>}
                type="string"
                placeholder="6개월"
                id="date"
                value={date || ""}
                onChange={(e) => setDate(e.target.value)}
              />

              <TextField
                sx={{ m: 1, width: "90%" }}
                id="outlined-multiline-static"
                label={<span style={{ fontFamily: "GmarketSans" }}>상세</span>}
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                inputProps={{ style: { fontFamily: "GmarketSans" } }}
              />
              <Grid>
                {editingIndex.idx === -1 ? (
                  <Button
                    onClick={addProject}
                    disabled={!isFormValid}
                    style={{
                      backgroundColor: "#117864",
                      borderColor: "#007bff",
                      fontFamily: "GmarketSans",
                      borderRadius: "30px",
                      color: "white",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    추가
                  </Button>
                ) : (
                  <Button
                    onClick={editProject}
                    disabled={!isFormValid}
                    style={{
                      backgroundColor: "#117864",
                      borderColor: "#28a745",
                      borderRadius: "30px",
                      fontFamily: "GmarketSans",
                      color: "white",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    저장
                  </Button>
                )}
                <Button
                  onClick={handleCancleClick}
                  style={{
                    backgroundColor: "#6c757d",
                    borderColor: "#6c757d",
                    fontFamily: "GmarketSans",
                    borderRadius: "30px",
                    color: "white",
                    fontSize: "16px",
                    cursor: "pointer",
                    margin: "5px",
                  }}
                >
                  취소
                </Button>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Container>
    </div>
  );
}
