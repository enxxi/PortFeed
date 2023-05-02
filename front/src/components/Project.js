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
// projectData => 해당 유저의 프로젝트 정보
export function Project({ isEditable, projectData }) {
  // props로 가져온 projectData 를 상태값으로 선언한다.
  const [project, setProject] = useState(projectData);

  // 프로젝트 작성중인지 상태값 선언
  const [isCreating, setIsCreating] = useState(false);

  // 프로젝트 추가 시 input 값 state 선언
  const [projectitem, setProjectitem] = useState("");
  const [description, setDescription] = useState("");

  // 프로젝트 수정중인지 상태값 선언
  const [editingIndex, setEditingIndex] = useState(-1);

  // projectitem 값 공백만 입력시 추가버튼 클릭불가처리, description은 필수값 아님
  const isFormValid = projectitem.replaceAll(" ", "");

  // 프로젝트 추가
  const addProject = async () => {
    try {
      // projectitem 주소(임시주소)로 post 요청을 보낸다. **** 백엔드 구성완료시 주석해제
      // await Api.post("project", { projectitem, description });

      // 프로젝트 상태값도 갱신하며 컴포넌트를 재렌더링한다.
      setProject((project) => {
        const newProject = [...project];
        newProject.push({ projectitem, description });
        return newProject;
      });

      setProjectitem("");
      setDescription("");
    } catch (err) {
      console.log(err);
    }
  };

  //프로젝트 삭제
  const removeProject = async (idx) => {
    if (window.confirm("삭제 하시겠습니까?")) {
      try {
        // project/idx 주소(임시주소)로 delete 요청을 보낸다.   **** 백엔드 구성완료시 주석해제
        // await Api.delete("project", idx);

        // 상태값도 갱신하며 컴포넌트를 재렌더링한다.
        setProject((project) => {
          const newProject = [...project];
          newProject.splice(idx, 1);
          return newProject;
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      return;
    }
  };

  // 프로젝트 편집
  const editProject = (idx) => {
    setEditingIndex(idx);
    setProject(project[idx].projectitem);
    setProject(project[idx].description);
  };

  const saveProject = async () => {
    try {  
      //기존의 프로젝트를 새로 입력한 프로젝트로 교체
      setProject((prevProject) => {
        const updatedProject = [...prevProject];
        updatedProject[editingIndex] = { projectitem, description };
        return updatedProject;
      });
  
      setProjectitem("");
      setDescription("");
      setEditingIndex(-1);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container>
      <Grid container spacing={2}>
      <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">프로젝트</Typography>
          </Box>
        </Grid>

      {
        /* projectData 길이 만큼 순환하여 출력 */
        project.length > 0 &&
          project.map((item, idx) => (
            <Grid item xs={12} key={idx}>
              <Paper>
                <Box padding={2} display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" flexDirection="column">
                  <Typography variant="body1">{item.projectitem}</Typography>
                  <Typography variant="body1">{item.description}</Typography>
                </Box>
               
              {isEditable && (
              <Box>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Edit />}
                  onClick={() => {
                    editProject(idx);
                    setIsCreating(true);
                  }}
                >
                  편집
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Delete />}
                  onClick={() => removeProject(idx)}
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
      </Grid>
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
              placeholder="프로젝트명"
              value={projectitem}
              onChange={(e) => setProjectitem(e.target.value)}
            />
            <Input
              type="text"
              placeholder="프로젝트 내용"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {editingIndex === -1 ? (
            <Button onClick={addProject} disabled={!isFormValid}>
              추가
            </Button>
            ) : (
              <Button onClick={saveProject} disabled={!isFormValid}>
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
