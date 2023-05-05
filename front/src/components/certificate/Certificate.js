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

export function Certificate({ isEditable }) {
  //user정보 불러오기/
  const params = useParams();
  const { user } = useContext(UserStateContext);
  const user_id = useMemo(() => {
    return isEditable ? user?.id : params?.userId;
  }, [isEditable, user, params]);

  const [certificate, setCertificate] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [certificateLoaded, setCertificateLoded] = useState(false);

  // 추가 시 input 값 state 선언
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  // 수정중인지 상태값 선언
  const [editingIndex, setEditingIndex] = useState({ idx: -1, id: "" });

  const [isDateValid, setIsdateValid] = useState(true);

  const now = new Date();
  const currentYear = now.getFullYear();

  // init component
  useEffect(() => {
    // api 호출
    Api.get(`certificate/${user_id}/0`)
      .then((res) => {
        setCertificate(res.data);
        setCertificateLoded(true);
      })
      .catch((err) => console.log(err));
    // 그 결과를 배열 컴포넌트에 뿌려줌
  }, [user_id]);

  // 추가
  const addCertificate = async () => {
    setName("");
    setOrganization("");
    setDate("");
    setDescription("");
    try {
      const result = await Api.post(`certificate/${user_id}/0`, {
        name,
        organization,
        date,
        description,
      }).catch((err) => {
        throw new Error(err.response.data.error);
      });

      const certificate_id = result.data.certificate_id;

      // 상태값 갱신하며 컴포넌트를 재렌더링
      setCertificate((certificate) => {
        const newCertificate = [...certificate];
        newCertificate.push({
          name,
          organization,
          date,
          description,
          certificate_id,
        });
        return newCertificate;
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
  const handleEditClick = async (idx, certificate_id) => {
    setEditingIndex((item) => {
      const newEditingIndex = { ...item };
      newEditingIndex.idx = idx;
      newEditingIndex.id = certificate_id;
      return newEditingIndex;
    });
    setName(certificate[idx].name);
    setOrganization(certificate[idx].organization);
    setDate(certificate[idx].date);
    setDescription(certificate[idx].description);
    setIsdateValid(true);
  };

  // 편집
  const editCertificate = async () => {
    try {
      const result = await Api.patch(
        `certificate/${user_id}/${editingIndex.id}`,
        {
          name,
          organization,
          date,
          description,
        }
      ).catch((err) => {
        throw new Error(err.response.data.error);
      });

      setCertificate((prevCertificate) => {
        const newCertificate = [...prevCertificate];
        newCertificate[editingIndex.idx] = result.data;
        return newCertificate;
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
  const removeCertificate = async (idx, id) => {
    Swal.fire({
      icon: "error",
      text: "삭제 하시겠습니까?",
      showCancelButton: true,
      allowOutsideClick: false,
    }).then(async function (result) {
      if (result.isConfirmed) {
        try {
          await Api.delete(`certificate/${user_id}/${id}`, "").catch((err) => {
            throw new Error(err.response.data.error);
          });
  
          // 상태값 갱신하며 컴포넌트를 재렌더링
          setCertificate((certificate) => {
            const newCertificate = [...certificate];
            newCertificate.splice(idx, 1);
            return newCertificate;
          });
          setName("");
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
    setName("");
    setOrganization("");
    setDescription("");
  };

  // 취소버튼 클릭
  const handleCancleClick = () => {
    setName("");
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
    name.replaceAll(" ", "") && organization.replaceAll(" ", "") && isDateValid;

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
                자격증
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} style={{ backgroundColor: "#F0F0F0" }}>
            <Paper>
              {!certificateLoaded ? (
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
              ) : certificate.length > 0 ? (
                certificate.map((item, idx) => (
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
                        {item.name}
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
                        {item.date ? `${item.date}년 취득` : ""}
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
                            handleEditClick(idx, item.certificate_id);
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
                            removeCertificate(idx, item.certificate_id)
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
            <Grid>
              <TextField
                sx={{ m: 2, width: "auto" }}
                required
                id="outlined-required"
                label={
                  <span style={{ fontFamily: "GmarketSans" }}>자격증</span>
                }
                value={name}
                inputProps={{ style: { fontFamily: "GmarketSans" } }}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                sx={{ m: 2, width: "auto", fontFamily: "GmarketSans" }}
                required
                id="outlined-required"
                inputProps={{ style: { fontFamily: "GmarketSans" } }}
                label={
                  <span style={{ fontFamily: "GmarketSans" }}>발급기관</span>
                }
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              />
              <TextField
                sx={{ m: 2, width: "auto" }}
                required
                label={
                  <span style={{ fontFamily: "GmarketSans" }}>발급년도</span>
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
                    onClick={addCertificate}
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
                    onClick={editCertificate}
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
      <div style={{ marginBottom: "2rem" }}></div>
    </div>
  );
}
