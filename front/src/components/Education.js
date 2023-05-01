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
// educationData => 해당 유저의 학력정보
export function Education({ isEditable, educationData }) {
  // props로 가져온 educationData 를 상태값으로 선언한다.
  const [education, setEducation] = useState(educationData);

  // 학력 작성중인지 상태값 선언
  const [isCreating, setIsCreating] = useState(false);

  // 학력 추가 시 input 값 state 선언
  const [school, setSchool] = useState("");
  const [major, setMajor] = useState("");

  // 학력 수정중인지 상태값 선언
  const [editingIndex, setEditingIndex] = useState(-1);

  // school 값 공백만 입력시 추가버튼 클릭불가처리, 전공은 필수값 아님
  const isFormValid = school.replaceAll(" ", "");

  // 학력 추가
  const addEducation = async () => {
    try {
      // education 주소(임시주소)로 post 요청을 보낸다. **** 백엔드 구성완료시 주석해제
      // await Api.post("education", { school, major });

      // 학력상태값도 갱신하며 컴포넌트를 재렌더링한다.
      setEducation((education) => {
        const newEducation = [...education];
        newEducation.push({ school, major });
        return newEducation;
      });

      setSchool("");
      setMajor("");
    } catch (err) {
      console.log(err);
    }
  };

  //학력 삭제
  const removeEducation = async (idx) => {
    if (window.confirm("삭제 하시겠습니까?")) {
      try {
        // education/idx 주소(임시주소)로 delete 요청을 보낸다.   **** 백엔드 구성완료시 주석해제
        // await Api.delete("education", idx);

        // 학력상태값도 갱신하며 컴포넌트를 재렌더링한다.
        setEducation((education) => {
          const newEducation = [...education];
          newEducation.splice(idx, 1);
          return newEducation;
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      return;
    }
  };
// 학력 편집
  const editEducation = (idx) => {
    setEditingIndex(idx);
    setSchool(education[idx].school);
    setMajor(education[idx].major);
  };

  const saveEducation = async () => {
    try {  
      //기존의 학력사항을 새로 입력한 학력사항을 교체
      setEducation((prevEducation) => {
        const updatedEducation = [...prevEducation];
        updatedEducation[editingIndex] = { school, major };
        return updatedEducation;
      });
  
      setSchool("");
      setMajor("");
      setEditingIndex(-1);
    } catch (err) {
      console.log(err);
    }
  };
//mui로 Education MVP를 입힘. 학력사항 추가 이후 수정 가능하게 편집 버튼 추가
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">학력</Typography>
            {isEditable && (
              <IconButton>
                <Edit />
              </IconButton>
            )}
          </Box>
        </Grid>

        {education.length > 0 &&
          education.map((item, idx) => (
            <Grid item xs={12} key={idx}>
              <Paper>
                <Box padding={2} display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" flexDirection="column">
                    <Typography variant="body1">{item.school}</Typography>
                    <Typography variant="body1">{item.major}</Typography>
                  </Box>
                  {
                    isEditable && (
                      <Box>
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<Edit />}
                          onClick={() => {
                            editEducation(idx);
                            setIsCreating(true);
                          }}
                        >
                          편집
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<Delete />}
                          onClick={() => removeEducation(idx)}
                        >
                          삭제
                        </Button>
                      </Box>
                    )
                  }
                </Box>
              </Paper>
            </Grid>
          ))}
      </Grid>

      {isEditable && !isCreating && (
        <Box marginTop={2}>
          <Button onClick={() => setIsCreating(!isCreating)} variant="outlined">
            +
          </Button>
        </Box>
      )}

      {
        isCreating && (
          <>
            <Input
              type="text"
              placeholder="학교"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
            />
            <Input
              type="text"
              placeholder="전공"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
            />
            {editingIndex === -1 ? (
              <Button onClick={addEducation} disabled={!isFormValid}>
                추가
              </Button>
            ) : (
              <Button onClick={saveEducation} disabled={!isFormValid}>
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