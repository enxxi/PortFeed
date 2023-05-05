import React, { useState, useEffect, useContext, useMemo } from "react";
import { UserStateContext } from "../../App";
import * as Api from "../../lib/apis/api";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Typography,
  TextField,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

export function Award({ isEditable }) {
  //user정보 불러오기/
  const params = useParams();
  const { user } = useContext(UserStateContext);
  const user_id = useMemo(() => {
    return isEditable ? user?.id : params?.userId;
  }, [isEditable, user, params]);

  const [award, setAward] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [awardLoaded, setAwardLoded] = useState(false);

  // 추가 시 input 값 state 선언
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [date, setDate] = useState();
  const [description, setDescription] = useState("");

  // 수정중인지 상태값 선언
  const [editingIndex, setEditingIndex] = useState({ idx: -1, id: "" });

  const [isDateValid, setIsdateValid] = useState(true);

  const now = new Date();
  const currentYear = now.getFullYear();

  // init component
  useEffect(() => {
    if (user_id) {
      // api 호출
      Api.get(`award/${user_id}/0`)
        .then((res) => {
          setAward(res.data);
          setAwardLoded(true);
        })
        .catch((err) => console.log(err));
      // 그 결과를 배열 컴포넌트에 뿌려줌
    }
  }, [user_id]);

  // 추가
  const addAward = async () => {
    setTitle("");
    setOrganization("");
    setDate("");
    setDescription("");
    try {
      const result = await Api.post(`award/${user_id}/0`, {
        title,
        organization,
        description,
        date,
      }).catch((err) => {
        throw new Error(err.response.data.error);
      });

      const award_id = result.data.award_id;

      // 상태값 갱신하며 컴포넌트를 재렌더링
      setAward((award) => {
        const newEducation = [...award];
        newEducation.push({ title, organization, date, description, award_id });
        return newEducation;
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
  const handleEditClick = async (idx, award_id) => {
    setEditingIndex((item) => {
      const newEditingIndex = { ...item };
      newEditingIndex.idx = idx;
      newEditingIndex.id = award_id;
      return newEditingIndex;
    });
    setTitle(award[idx].title);
    setOrganization(award[idx].organization);
    setDate(award[idx].date);
    setDescription(award[idx].description);
    setIsdateValid(true);
  };

  // 편집
  const editAward = async () => {
    try {
      const result = await Api.patch(`award/${user_id}/${editingIndex.id}`, {
        title,
        organization,
        date,
        description,
      }).catch((err) => {
        throw new Error(err.response.data.error);
      });

      setAward((prevAward) => {
        const newAward = [...prevAward];
        newAward[editingIndex.idx] = result.data;
        return newAward;
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
  const removeAward = async (idx, id) => {
    Swal.fire({
      icon: "error",
      text: "삭제 하시겠습니까?",
      showCancelButton: true,
      allowOutsideClick: false,
    }).then(async function (result) {
      if (result.isConfirmed) {
        try {
          await Api.delete(`award/${user_id}/${id}`, "").catch((err) => {
            throw new Error(err.response.data.error);
          });
  
          // 상태값 갱신하며 컴포넌트를 재렌더링
          setAward((award) => {
            const newAward = [...award];
            newAward.splice(idx, 1);
            return newAward;
          });
          setTitle("");
          setOrganization("");
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
    setOrganization("");
    setDate("");
    setDescription("");
  };

  // 취소버튼 클릭
  const handleCancleClick = () => {
    setTitle("");
    setOrganization("");
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

  const validateDate = (date) => {
    return date >= 2000 && date <= currentYear;
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
    setIsdateValid(validateDate(e.target.value));
  };

  // input 값 validation
  const isFormValid =
    title.replaceAll(" ", "") &&
    organization.replaceAll(" ", "") &&
    isDateValid;

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
                수상이력
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} style={{ backgroundColor: "#F0F0F0" }}>
            <Paper>
              {!awardLoaded ? (
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
              ) : award.length > 0 ? (
                award.map((item, idx) => (
                  <Box
                    padding={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
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
                        sx={{ pl: 2, width: "auto", fontFamily: "GmarketSans" }}
                        variant="span"
                      >
                        {item.organization}
                      </Typography>
                      <Typography
                        sx={{ pl: 2, width: "auto", fontFamily: "GmarketSans" }}
                        variant="span"
                      >
                        {item.date ? `${item.date}년 수상` : ""}
                      </Typography>
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
                    </Box>
                    {isEditable && (
                      <Box>
                        <IconButton
                          color="inherit"
                          aria-label="edit"
                          onClick={() => {
                            handleEditClick(idx, item.award_id);
                            setIsCreating(true);
                          }}
                        >
                          <BorderColorIcon
                            sx={{ width: "24px", height: "24px" }}
                          />
                        </IconButton>
                        <IconButton
                          variant="outlined"
                          onClick={() => removeAward(idx, item.award_id)}
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
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ fontFamily: "GmarketSans" }}
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
              aria-label="add"
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
              mr: 5,
              p: 2,
              textAlign: "center",
            }}
          >
            <Grid>
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
                  <span style={{ fontFamily: "GmarketSans" }}>수상명</span>
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
                }}
                required
                id="outlined-required"
                label={
                  <span style={{ fontFamily: "GmarketSans" }}>발급기관</span>
                }
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              />
              <TextField
                sx={{
                  m: 2,
                  width: "auto",
                  "& input": {
                    fontFamily: "GmarketSans",
                  },
                }}
                required
                label={
                  <span style={{ fontFamily: "GmarketSans" }}>수상년도</span>
                }
                type="number"
                InputProps={{
                  sx: { fontFamily: "GmarketSans" },
                  inputProps: { min: 2000, max: 2023 },
                }}
                placeholder="2000"
                InputLabelProps={{
                  shrink: true,
                }}
                id="date"
                value={date || ""}
                onChange={handleDateChange}
                error={!isDateValid && date !== ""}
                helperText={
                  !isDateValid &&
                  date !== "" &&
                  `2000~${currentYear}년 사이로 입력해주세요.`
                }
              />
              <TextField
                sx={{ m: 1, width: "90%" }}
                id="outlined-multiline-static"
                label={<span style={{ fontFamily: "GmarketSans" }}>상세</span>}
                multiline
                rows={4}
                value={description}
                inputProps={{ style: { fontFamily: "GmarketSans" } }}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Grid>
                {editingIndex.idx === -1 ? (
                  <Button
                    onClick={addAward}
                    disabled={!isFormValid || date === ""}
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
                    추가
                  </Button>
                ) : (
                  <Button
                    onClick={editAward}
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

                    borderRadius: "30px",
                    fontFamily: "GmarketSans",
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
