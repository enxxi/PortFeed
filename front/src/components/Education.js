import React, { useState, useEffect, useContext } from "react";
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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useParams } from "react-router-dom";

export function Education({ isEditable}) {

  //user정보 불러오기/
  const params = useParams();
  const {user} = useContext(UserStateContext);
  const user_id = isEditable? user?.id : params?.userId;
  const jwtToken = sessionStorage.getItem('userToken');

  const [education, setEducation] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  // 추가 시 input 값 state 선언
  const [school, setSchool] = useState("");
  const [major, setMajor] = useState("");
  const [degree, setDegree] = useState("");

  // 수정중인지 상태값 선언
  const [editingIndex, setEditingIndex] = useState({idx: -1, id: ""});

  // input 값 validation
  const isFormValid = school.replaceAll(" ", "") && major.replaceAll(" ", "") && degree;
  
  // init component
  useEffect(() => {
    // api 호출
    Api.get(`education/${user_id}/0`)
      .then((res) => {
        setEducation(res.data);
      })
      .catch((err) => console.log(err));
    // 그 결과를 배열 컴포넌트에 뿌려줌
  }, []);

  // 추가
  const addEducation = async () => {
    setSchool("");
    setMajor("");
    setDegree("");
    try {
      const result = await Api.post(
        `education/${user_id}/0`,
        {
          school,
          major,
          degree,
        },
        {
          headers: {
            Authorization: jwtToken,
          },
        }
      );
      
      const education_id = result.data.education_id;

      // 상태값 갱신하며 컴포넌트를 재렌더링
      setEducation((education) => {
        const newEducation = [...education];
        newEducation.push({ school, major, degree, education_id});
        return newEducation;
      });

    } catch (err) {
      console.log(err);
    }
  };

  // 편집버튼클릭
  const handleEditClick = async (idx, education_id) => {
    setEditingIndex((item) => {
      const newEditingIndex = {...item};
      newEditingIndex.idx = idx;
      newEditingIndex.id = education_id;
      return newEditingIndex;
    });
    setSchool(education[idx].school);
    setMajor(education[idx].major);
    setDegree(education[idx].degree);
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
        },
        {
          headers: {
            Authorization: jwtToken,
          },
        }
      );

      setEducation((prevEducation) => {
        const newEducation = [...prevEducation];
        newEducation[editingIndex.idx] = result.data;
        return newEducation;
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
  const removeEducation = async (idx, id) => {
    if (window.confirm("삭제 하시겠습니까?")) {
      try {
        
        await Api.delete(`education/${user_id}/${id}`, "");

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
        console.log(err);
      }
    } else {
      return;
    }
  };

  // +버튼 클릭
  const handlePlusClick = () => {
    setIsCreating(!isCreating)
    setSchool("");
    setMajor("");
    setDegree("");
  }

  // 취소버튼 클릭
  const handleCancleClick = () => {
    setSchool("");
    setMajor("");
    setDegree("");
    setIsCreating(!isCreating)
    setEditingIndex(item => {
      const newEditingIndex = {...item};
      newEditingIndex.idx = -1;
      newEditingIndex.id = "";
      return newEditingIndex;
    })

  }

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h4">학력</Typography>
          </Box>
        </Grid>
            <Grid item xs={12} >
              <Paper>
              {education.length > 0
              ? education.map((item, idx) => (
                <Box
                  key={idx}
                  padding={2}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography sx={{width:"auto"}} variant="span">{item.school}</Typography>
                    <Typography sx={{pl:2, width:"auto"}} variant="span">{item.major}</Typography>
                    <Typography sx={{pl:2, width:"auto"}} variant="span">{item.degree}</Typography>
                  </Box>
                  {isEditable && (
                    <Box>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<Edit />}
                        onClick={() => {
                          handleEditClick(idx, item.education_id);
                          setIsCreating(true);
                        }}
                      >
                        편집
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => removeEducation(idx, item.education_id)}
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
        <>
          <TextField
            sx={{m:2, width:"auto"}}
            required
            id="outlined-required"
            label="학교"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
          />
          <TextField 
            sx={{m:2, width:"auto"}}
            required
            id="outlined-required"
            label="전공"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
          />
          <FormControl sx={{m:"5px", p:"5px", border:"2px groove", borderRadius: "5px"}}>
            <FormLabel id="demo-row-radio-buttons-group-label">과정*</FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel value="학사" control={<Radio />} label="학사" 
                onChange={e=>setDegree(e.target.value)}
                checked={degree === "학사"}
              />
              <FormControlLabel value="박사" control={<Radio />} label="박사" 
                onChange={e=>setDegree(e.target.value)}
                checked={degree === "박사"}
              />
              <FormControlLabel value="석사" control={<Radio />} label="석사"
                onChange={e=>setDegree(e.target.value)}
                checked={degree === "석사"}
              />
            </RadioGroup>
          </FormControl>
          <Grid>
          {editingIndex.idx === -1 ? (
            <Button onClick={addEducation} disabled={!isFormValid}>
              추가
            </Button>
          ) : (
            <Button onClick={editEducation} disabled={!isFormValid}>
              저장
            </Button>
          )}
          <Button onClick={handleCancleClick}>취소</Button>
          </Grid>
        </>
      )}
      
    </Container>
  );
}
