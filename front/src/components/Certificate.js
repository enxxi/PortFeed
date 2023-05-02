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
// certificateData => 해당 유저의 학력정보
export function Certificate({ isEditable, certificateData }) {
  // props로 가져온 certificateData 를 상태값으로 선언한다.
  const [certificate, setCertificate] = useState(certificateData);

  // 자격증 작성중인지 상태값 선언
  const [isCreating, setIsCreating] = useState(false);

  // 자격증 추가 시 input 값 state 선언
  const [certification, setCertification] = useState("");
  const [organization, setOrganization] = useState("");

  // 자격증 수정중인지 상태값 선언
  const [editingIndex, setEditingIndex] = useState(-1);

  // certification 값 공백만 입력시 추가버튼 클릭불가처리, 기관은 필수값 아님
  const isFormValid = certification.replaceAll(" ", "");

  // 자격증 추가
  const addCertificate = async () => {
    try {
      // certificate 주소(임시주소)로 post 요청을 보낸다. **** 백엔드 구성완료시 주석해제
      // await Api.post("certificate", { certification, organization });

      // 상태값도 갱신하며 컴포넌트를 재렌더링한다.
      setCertificate((certificate) => {
        const newCertificate = [...certificate];
        newCertificate.push({ certification, organization });
        return newCertificate;
      });

      setCertification("");
      setOrganization("");
    } catch (err) {
      console.log(err);
    }
  };

  //자격증 삭제
  const removeCertificate = async (idx) => {
    if (window.confirm("삭제 하시겠습니까?")) {
      try {
        // Certificate/idx 주소(임시주소)로 delete 요청을 보낸다.   **** 백엔드 구성완료시 주석해제
        // await Api.delete("Certificate", idx);

        // 학력상태값도 갱신하며 컴포넌트를 재렌더링한다.
        setCertificate((certificate) => {
          const newCertificate = [...certificate];
          newCertificate.splice(idx, 1);
          return newCertificate;
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      return;
    }
  };

  // 자격증 편집
  const editCertificate = (idx) => {
    setEditingIndex(idx);
    setCertification(certificate[idx].certification);
    setOrganization(certificate[idx].organization);
  };

  const saveCertificate = async () => {
    try {  
      //기존의 자격증을 새로 입력한 자격증으로 교체
      setCertificate((prevCertificate) => {
        const updatedCertificate = [...prevCertificate];
        updatedCertificate[editingIndex] = { certification, organization };
        return updatedCertificate;
      });
  
      setCertification("");
      setOrganization("");
      setEditingIndex(-1);
    } catch (err) {
      console.log(err);
    }
  };

  //mui로 Certificate MVP를 입힘. 학력사항 추가 이후 수정 가능하게 편집 버튼 추가
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">자격증</Typography>
          </Box>
        </Grid>

      {
        /* certificateData 길이 만큼 순환하여 출력 */
        certificate.length > 0 &&
        certificate.map((item, idx) => (
          <Grid item xs={12} key={idx}>
            <Paper>
              <Box padding={2} display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" flexDirection="column">
                  <Typography variant="body1">{item.certification}</Typography>
                  <Typography variant="body1">{item.organization}</Typography>
                </Box>
               
              {isEditable && (
              <Box>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Edit />}
                  onClick={() => {
                    editCertificate(idx);
                    setIsCreating(true);
                  }}
                >
                  편집
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Delete />}
                  onClick={() => removeCertificate(idx)}
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
              placeholder="자격종류"
              value={certification}
              onChange={(e) => setCertification(e.target.value)}
            />
            <Input
              type="text"
              placeholder="발급기관"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
            />
            {editingIndex === -1 ? (
            <Button onClick={addCertificate} disabled={!isFormValid}>
              추가
            </Button>
            ) : (
              <Button onClick={saveCertificate} disabled={!isFormValid}>
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
