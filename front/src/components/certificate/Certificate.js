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
  TextField
} from "@mui/material";

import { Delete, Edit } from "@mui/icons-material";
import { useParams } from "react-router-dom";

export function Certificate({ isEditable}) {

  //user정보 불러오기/
  const params = useParams();
  const {user} = useContext(UserStateContext);
  const user_id = useMemo(() => {
    return isEditable? user?.id : params?.userId; 
  }, [isEditable, user, params]);

  const [certificate, setCertificate] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  // 추가 시 input 값 state 선언
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [date, setDate] = useState();
  const [description, setDescription] = useState("");

  // 수정중인지 상태값 선언
  const [editingIndex, setEditingIndex] = useState({idx: -1, id: ""});

  // input 값 validation
  const isFormValid = name.replaceAll(" ", "") && organization.replaceAll(" ", "");

  // init component
  useEffect(() => {
    // api 호출
    Api.get(`certificate/${user_id}/0`)
      .then((res) => {
        setCertificate(res.data);
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
      const result = await Api.post(
        `certificate/${user_id}/0`,
        {
          name,
          organization,
          date,
          description,
        }
      );
      
      const certificate_id = result.data.certificate_id;

      // 상태값 갱신하며 컴포넌트를 재렌더링
      setCertificate((certificate) => {
        const newCertificate = [...certificate];
        newCertificate.push({ name, organization, date, description, certificate_id});
        return newCertificate;
      });

    } catch (err) {
      console.log(err);
    }
  };

  // 편집버튼클릭
  const handleEditClick = async (idx, certificate_id) => {
    setEditingIndex((item) => {
      const newEditingIndex = {...item};
      newEditingIndex.idx = idx;
      newEditingIndex.id = certificate_id;
      return newEditingIndex;
    });
    setName(certificate[idx].name);
    setOrganization(certificate[idx].organization);
    setDate(certificate[idx].date);
    setDescription(certificate[idx].description);
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
      );

      setCertificate((prevCertificate) => {
        const newCertificate = [...prevCertificate];
        newCertificate[editingIndex.idx] = result.data;
        return newCertificate;
      });
      setEditingIndex((item) => {
        const newEditingIndex = {...item};
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
  const removeCertificate = async (idx, id) => {
    if (window.confirm("삭제 하시겠습니까?")) {
      try {
        await Api.delete(`certificate/${user_id}/${id}`, "");

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
        console.log(err);
      }
    } else {
      return;
    }
  };

  // +버튼 클릭
  const handlePlusClick = () => {
    setIsCreating(!isCreating)
    setName("");
    setOrganization("");
    setDescription("");
  }

  // 취소버튼 클릭
  const handleCancleClick = () => {
    setName("");
    setOrganization("");
    setDate("");
    setDescription("");
    setIsCreating(!isCreating)
    setEditingIndex(item => {
      const newEditingIndex = {...item};
      newEditingIndex.idx = -1;
      newEditingIndex.id = "";
      return newEditingIndex;
    })

  }

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
            <Typography variant="h4">자격증</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} >
          <Paper>
          {certificate.length > 0
            ? certificate.map((item, idx) => (
              <Box
                padding={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                key={idx}
              >
                <Box>
                  <Typography sx={{width:"auto"}} variant="span">{item.name}</Typography>
                  <Typography sx={{pl:2, width:"auto"}} variant="span">{item.organization}</Typography>
                  <Typography sx={{pl:2, width:"auto"}} variant="span">{item.date}</Typography>
                  <Typography display="flex" sx={{p:1}} variant="span">{item.description}</Typography>
                </Box>
                {isEditable && (
                  <Box>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<Edit />}
                      onClick={() => {
                        handleEditClick(idx, item.certificate_id);
                        setIsCreating(true);
                      }}
                    >
                      편집
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => removeCertificate(idx, item.certificate_id)}
                    >
                      삭제
                    </Button>
                  </Box>
                )}
            </Box>))
          :<Grid item xs={12}> 
          <Paper>
            <Box
              padding={2}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >이력이 없습니다.
            </Box>
          </Paper>
        </Grid>}
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
        <Grid >
            <TextField
            sx={{m:2, width:"auto"}}
            required
            id="outlined-required"
            label="자격증"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField 
            sx={{m:2, width:"auto"}}
            required
            id="outlined-required"
            label="발급기관"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
          />
          <TextField 
            sx={{m:2, width:"auto"}}
            label="취득일"
            type="date"
            InputLabelProps={{
              shrink: true
            }}
            id="date"
            value={date || ""}
            onChange={(e) => setDate(e.target.value)}
          />
          <TextField
            sx={{m:1, width:"90%"}}
            id="outlined-multiline-static"
            label="상세"
            multiline
            rows={4}
            value={description}
              onChange={(e) => setDescription(e.target.value)}
          />
        <Grid>
            {editingIndex.idx === -1 ? (
              <Button onClick={addCertificate} disabled={!isFormValid}>
                추가
              </Button>
            ) : (
              <Button onClick={editCertificate} disabled={!isFormValid}>
                저장
              </Button>
            )}
            <Button onClick={handleCancleClick}>취소</Button>
          </Grid>
        </Grid>
      )}
    </Container>
    <div style={{ marginBottom: "2rem" }}>
    </div>
    </div>
    
  );
}
