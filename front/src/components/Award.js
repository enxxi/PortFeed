import React, { useState, useEffect, useContext, useMemo } from "react";
import { UserStateContext } from "../App";
import * as Api from "../api";
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
import { useParams } from "react-router-dom";

export function Award({ isEditable }) {
  //user정보 불러오기/
  const params = useParams();
  const { user } = useContext(UserStateContext);
  const user_id = useMemo(() => {
    return isEditable ? user?.id : params?.userId;
  }, [isEditable, user, params]);

  const [award, setAward] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  // 추가 시 input 값 state 선언
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [description, setDescription] = useState("");

  // 수정중인지 상태값 선언
  const [editingIndex, setEditingIndex] = useState({ idx: -1, id: "" });

  // input 값 validation
  const isFormValid =
    title.replaceAll(" ", "") && organization.replaceAll(" ", "");

  // init component
  useEffect(() => {
    // api 호출
    Api.get(`award/${user_id}/0`)
      .then((res) => {
        setAward(res.data);
      })
      .catch((err) => console.log(err));
    // 그 결과를 배열 컴포넌트에 뿌려줌
  }, [user_id]);

  // 추가
  const addAward = async () => {
    setTitle("");
    setOrganization("");
    setDescription("");
    try {
      const result = await Api.post(`award/${user_id}/0`, {
        title,
        organization,
        description,
      });

      const award_id = result.data.award_id;

      // 상태값 갱신하며 컴포넌트를 재렌더링
      setAward((award) => {
        const newEducation = [...award];
        newEducation.push({ title, organization, description, award_id });
        return newEducation;
      });
    } catch (err) {
      console.log(err);
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
    setDescription(award[idx].description);
  };

  // 편집
  const editAward = async () => {
    try {
      const result = await Api.patch(`award/${user_id}/${editingIndex.id}`, {
        title,
        organization,
        description,
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
      console.log(err);
    }
  };

  // 삭제
  const removeAward = async (idx, id) => {
    if (window.confirm("삭제 하시겠습니까?")) {
      try {
        await Api.delete(`award/${user_id}/${id}`, "");

        // 상태값 갱신하며 컴포넌트를 재렌더링
        setAward((award) => {
          const newAward = [...award];
          newAward.splice(idx, 1);
          return newAward;
        });
        setTitle("");
        setOrganization("");
        setDescription("");
      } catch (err) {
        console.log(err);
      }
    } else {
      return;
    }
  };

  // +버튼 클릭
  const handlePlusClick = () => {
    setIsCreating(!isCreating);
    setTitle("");
    setOrganization("");
    setDescription("");
  };

  // 취소버튼 클릭
  const handleCancleClick = () => {
    setTitle("");
    setOrganization("");
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
              <Typography style={{ color: "#117864" }} variant="h4">
                수상이력
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} style={{ backgroundColor: "#F0F0F0" }}>
            <Paper>
              {award.length > 0 ? (
                award.map((item, idx) => (
                  <Box
                    padding={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    key={idx}
                  >
                    <Box>
                      <Typography sx={{ width: "auto" }} variant="span">
                        {item.title}
                      </Typography>
                      <Typography sx={{ pl: 2, width: "auto" }} variant="span">
                        {item.organization}
                      </Typography>
                      <Typography display="flex" sx={{ p: 1 }} variant="span">
                        {item.description}
                      </Typography>
                    </Box>
                    {isEditable && (
                      <Box>
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<Edit />}
                          onClick={() => {
                            handleEditClick(idx, item.award_id);
                            setIsCreating(true);
                          }}
                        >
                          편집
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => removeAward(idx, item.award_id)}
                        >
                          삭제
                        </Button>
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
            <Button onClick={handlePlusClick} variant="outlined">
              +
            </Button>
          </Box>
        )}

        {isCreating && (
          <Grid>
            <TextField
              sx={{ m: 2, width: "auto" }}
              required
              id="outlined-required"
              label="수상명"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              sx={{ m: 2, width: "auto" }}
              required
              id="outlined-required"
              label="발급기관"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
            />
            <TextField
              sx={{ m: 1, width: "90%" }}
              id="outlined-multiline-static"
              label="상세"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Grid>
              {editingIndex.idx === -1 ? (
                <Button onClick={addAward} disabled={!isFormValid}>
                  추가
                </Button>
              ) : (
                <Button onClick={editAward} disabled={!isFormValid}>
                  저장
                </Button>
              )}
              <Button onClick={handleCancleClick}>취소</Button>
            </Grid>
          </Grid>
        )}
      </Container>
    </div>
  );
}
