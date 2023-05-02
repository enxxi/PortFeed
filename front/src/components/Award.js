import React, { useState } from "react";
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
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

// props 로 User의 정보를 가져온다
// isEditable => 본인의 포트폴리오인지 상태값
// awardData => 해당 유저의 수상정보
export function Award({ isEditable, awardData }) {
  // props로 가져온 educationData 를 상태값으로 선언한다.
  const [award, setAward] = useState(awardData);

  // 수상이력 작성중인지 상태값 선언
  const [isCreating, setIsCreating] = useState(false);

  // 수상추가 시 input 값 state 선언
  const [awarddate, setAwarddate] = useState("");
  const [awarded, setAwarded] = useState("");

  // 수상이력 수정중인지 상태값 선언
  const [editingIndex, setEditingIndex] = useState(-1);

  // awarddate, awarded 모두 입력이 되어야지 추가 버튼이 활성화된다
  const isFormValid = () => {
    const isAwarddate = awarddate.trim() !== "";
    const isAwarded = awarded.trim() !== "";
    return isAwarddate && isAwarded;
  };

  // 수상이력 추가
  const addAward = async () => {
    try {
      // award 주소(임시주소)로 post 요청을 보낸다. **** 백엔드 구성완료시 주석해제
      // await Api.post("award", { awarddate, awarded });

      // 수상값도 갱신하며 컴포넌트를 재렌더링한다.
      setAward((award) => {
        const newAward = [...award];
        newAward.push({ awarddate, awarded });
        return newAward;
      });

      setAwarddate("");
      setAwarded("");
    } catch (err) {
      console.log(err);
    }
  };

  //수상이력 삭제
  const removeAward = async (idx) => {
    if (window.confirm("삭제 하시겠습니까?")) {
      try {
        // award/idx 주소(임시주소)로 delete 요청을 보낸다.   **** 백엔드 구성완료시 주석해제
        // await Api.delete("education", idx);

        // 수상값도 갱신하며 컴포넌트를 재렌더링한다.
        setAward((award) => {
          const newAward = [...award];
          newAward.splice(idx, 1);
          return newAward;
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      return;
    }
  };

  // 수상이력 편집
  const editAward = (idx) => {
    setEditingIndex(idx);
    setAwarddate(award[idx].awarddate);
    setAwarded(award[idx].awarded);
  };

  const saveAward = async () => {
    try {  
      //기존의 수상이력을 새로 입력한 수상이력으로 교체
      setAward((prevAward) => {
        const updatedAward = [...prevAward];
        updatedAward[editingIndex] = { awarddate, awarded };
        return updatedAward;
      });
  
      setAwarddate("");
      setAwarded("");
      setEditingIndex(-1);
    } catch (err) {
      console.log(err);
    }
  };


//mui로 Award MVP를 입힘. 추가 이후 편집 기능 추가
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">수상이력</Typography>
          </Box>
        </Grid>
      </Grid>
      {/* awardData 길이 만큼 순환하여 출력 */
        award.length > 0 &&
        award.map((item, idx) => (
          <Grid item xs={12} key={idx}>
            <Paper>
              <Box padding={2} display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" flexDirection="column">
                  <Typography variant="body1" sx={{ textAlign: "left" }}>{item.awarddate}</Typography>
                  <Typography variant="body1" sx={{ textAlign: "left" }}>{item.awarded}</Typography>
                </Box>
                {isEditable && (
                <Box>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<Edit />}
                    onClick={() => {
                      editAward(idx);
                      setIsCreating(true);
                    }}
                  >
                  편집
                  </Button>
                  <Button 
                    variant="outlined"
                    color="primary"
                    startIcon={<Delete />}
                    onClick={() => removeAward(idx)}
                  >
                    삭제
                  </Button>
                </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        ))
      }
      {
        /* 본인의 상세페에지이며, 작성중이 아닐시 + 버튼 출력 */
        isEditable && !isCreating && (
          <Box marginTop={2}>
            <Button onClick={() => setIsCreating(!isCreating)} variant="outlined">
              + 
            </Button>
          </Box>
        )
      }
      {
        /* 작성중일 시 input 출력 */
        isCreating && (
          <>
            <Input
              type="text"
              placeholder="수상날짜 0000-00-00"
              value={awarddate}
              onChange={(e) => setAwarddate(e.target.value)}
            />
            <Input
              type="text"
              placeholder="수상명"
              value={awarded}
              onChange={(e) => setAwarded(e.target.value)}
            />
            {editingIndex === -1 ? (
              <Button onClick={addAward} disabled={!isFormValid()}>
              추가
              </Button>
            ) : (
              <Button onClick={saveAward} disabled={!isFormValid()}>
                저장
              </Button>
            )}
            <Button onClick={() => setIsCreating(!isCreating)}>취소</Button>
          </>
        )
      }
    </Container>
  );
}
