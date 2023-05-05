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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

export function Education({ isEditable }) {
  //user정보 불러오기/
  const params = useParams();
  const { user } = useContext(UserStateContext);
  const user_id = useMemo(() => {
    return isEditable ? user?.id : params?.userId;
  }, [isEditable, user, params]);

  const [education, setEducation] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [educationLoaded, setEducationLoaded] = useState(false);
  // 추가 시 input 값 state 선언
  const [school, setSchool] = useState("");
  const [major, setMajor] = useState("");
  const [degree, setDegree] = useState("");

  const [isSchoolValid, setIsSchoolValid] = useState(true);

  // 수정중인지 상태값 선언
  const [editingIndex, setEditingIndex] = useState({ idx: -1, id: "" });

  // init component
  useEffect(() => {
    // api 호출
    Api.get(`education/${user_id}/0`)
      .then((res) => {
        setEducation(res.data);
        setEducationLoaded(true);
      })
      .catch((err) => console.log(err));
    // 그 결과를 배열 컴포넌트에 뿌려줌
  }, [user_id]);

  // 추가
  const addEducation = async () => {
    setSchool("");
    setMajor("");
    setDegree("");
    try {
      const result = await Api.post(`education/${user_id}/0`, {
        school,
        major,
        degree,
      }).catch((err) => {
        throw new Error(err.response.data.error);
      });

      const education_id = result.data.education_id;

      // 상태값 갱신하며 컴포넌트를 재렌더링
      setEducation((education) => {
        const newEducation = [...education];
        newEducation.push({ school, major, degree, education_id });
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
  const handleEditClick = async (idx, education_id) => {
    setEditingIndex((item) => {
      const newEditingIndex = { ...item };
      newEditingIndex.idx = idx;
      newEditingIndex.id = education_id;
      return newEditingIndex;
    });
    setSchool(education[idx].school);
    setMajor(education[idx].major);
    setDegree(education[idx].degree);
    setIsSchoolValid(true);
  };

  // 편집
  const editEducation = async () => {
    try {
      const result = await Api.patch(
        `education/${user_id}/${editingIndex.id}`,
        {
          school,
          major,
          degree,
        }
      ).catch((err) => {
        throw new Error(err.response.data.error);
      });

      setEducation((prevEducation) => {
        const newEducation = [...prevEducation];
        newEducation[editingIndex.idx] = result.data;
        return newEducation;
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
  const removeEducation = async (idx, id) => {
    Swal.fire({
      icon: "error",
      text: "삭제 하시겠습니까?",
      showCancelButton: true,
      allowOutsideClick: false,
    }).then(async function (result) {
      if (result.isConfirmed) {
        try {
          await Api.delete(`education/${user_id}/${id}`, "").catch((err) => {
            throw new Error(err.response.data.error);
          });
  
          // 상태값 갱신하며 컴포넌트를 재렌더링
          setEducation((education) => {
            const newEducation = [...education];
            newEducation.splice(idx, 1);
            return newEducation;
          });
          setSchool("");
          setMajor("");
          setDegree("");
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
    setSchool("");
    setMajor("");
    setDegree("");
  };

  // 취소버튼 클릭
  const handleCancleClick = () => {
    setSchool("");
    setMajor("");
    setDegree("");
    setIsCreating(!isCreating);
    setEditingIndex((item) => {
      const newEditingIndex = { ...item };
      newEditingIndex.idx = -1;
      newEditingIndex.id = "";
      return newEditingIndex;
    });
  };

  const validateSchool = (school) => {
    const regex = /학교|학원/;
    return regex.test(school);
  };

  const handleSchoolChange = (e) => {
    setSchool(e.target.value);
    setIsSchoolValid(validateSchool(e.target.value));
  };

  // input 값 validation
  const isFormValid = isSchoolValid && major.replaceAll(" ", "") && degree;

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
                학력
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} style={{ backgroundColor: "#F0F0F0" }}>
            <Paper>
              {!educationLoaded ? (
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
              ) : education.length > 0 ? (
                education.map((item, idx) => (
                  <Box
                    key={idx}
                    padding={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{textAlign: 'left'}}
                  >
                    <Box sx={{ backgroundColor: "#f0f0f0", padding: "1rem" }}>
                      <Typography
                        sx={{ width: "auto", fontFamily: "GmarketSans" }}
                        variant="span"
                      >
                        {item.school}
                      </Typography>
                      <Typography
                        sx={{ pl: 2, width: "auto", fontFamily: "GmarketSans" }}
                        variant="span"
                      >
                        {item.major}
                      </Typography>
                      <Typography
                        sx={{ pl: 2, width: "auto", fontFamily: "GmarketSans" }}
                        variant="span"
                      >
                        {item.degree}
                      </Typography>
                    </Box>
                    {isEditable && (
                      <Box>
                        <IconButton
                          color="inherit"
                          aria-label="edit"
                          onClick={() => {
                            handleEditClick(idx, item.education_id);
                            setIsCreating(true);
                          }}
                        >
                          <BorderColorIcon
                            sx={{ width: "24px", height: "24px" }}
                          />
                        </IconButton>
                        <IconButton
                          variant="outlined"
                          onClick={() =>
                            removeEducation(idx, item.education_id)
                          }
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
            <TextField
              sx={{
                m: 2,
                width: "auto",
                fontFamily: "GmarketSans",
                "& input": {
                  fontFamily: "GmarketSans",
                },
              }}
              required
              id="outlined-required"
              label="학교"
              value={school}
              onChange={handleSchoolChange}
              error={!isSchoolValid && school !== ""}
              helperText={
                !isSchoolValid &&
                school !== "" &&
                "학교 또는 학원이 들어가게 작성해주세요."
              }
              InputLabelProps={{
                sx: { fontFamily: "GmarketSans" },
              }}
            />
            <TextField
              sx={{
                m: 2,
                width: "auto",
                fontFamily: "GmarketSans",
                "& input": {
                  fontFamily: "GmarketSans",
                },
              }}
              required
              id="outlined-required"
              label="전공"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              InputLabelProps={{
                sx: { fontFamily: "GmarketSans" },
              }}
            />
            <FormControl
              sx={{
                m: "5px",
                p: "5px",
                border: "2px groove",
                borderRadius: "5px",
              }}
            >
              <FormLabel
                id="demo-row-radio-buttons-group-label"
                sx={{ fontFamily: "GmarketSans", fontSize: "14px" }}
              >
                과정*
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel
                  value="학사"
                  control={
                    <Radio sx={{ "&.Mui-checked": { color: "green" } }} />
                  }
                  label={
                    <span style={{ fontFamily: "GmarketSans" }}>학사</span>
                  }
                  sx={{ fontFamily: "GmarketSans" }}
                  onChange={(e) => setDegree(e.target.value)}
                  checked={degree === "학사"}
                />
                <FormControlLabel
                  value="석사"
                  control={
                    <Radio sx={{ "&.Mui-checked": { color: "green" } }} />
                  }
                  label={
                    <span style={{ fontFamily: "GmarketSans" }}>석사</span>
                  }
                  sx={{ fontFamily: "GmarketSans" }}
                  onChange={(e) => setDegree(e.target.value)}
                  checked={degree === "석사"}
                />
                <FormControlLabel
                  value="박사"
                  control={
                    <Radio sx={{ "&.Mui-checked": { color: "green" } }} />
                  }
                  label={
                    <span style={{ fontFamily: "GmarketSans" }}>박사</span>
                  }
                  sx={{ fontFamily: "GmarketSans" }}
                  onChange={(e) => setDegree(e.target.value)}
                  checked={degree === "박사"}
                />
              </RadioGroup>
            </FormControl>
            <Grid>
              {editingIndex.idx === -1 ? (
                <Button
                  onClick={addEducation}
                  disabled={!isFormValid || school === ""}
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
                  onClick={editEducation}
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
          </Paper>
        )}
      </Container>
      <style>
        {`
          @media only screen and (max-width: 1280px) {
            .menu {
              display: none;
            }
            .mobile-menu-icon {
              display: block;
            }
          }
        `}
      </style>
    </div>
  );
}
