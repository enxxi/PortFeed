import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Form, Card, Col, Row } from "react-bootstrap";
import { Grid, IconButton } from "@mui/material";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import * as Api from "../../lib/apis/api";

function UserFileEditForm({ user, setIsEditing, setUser, isEditable }) {
    const [file, setFile] = useState();
    const [isEditing, setIsEditingFile] = useState(false);
    const {pathname} = useLocation();
    const [fileSelected, setFileSelected] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(file);
        
        const formData = new FormData();
        formData.append('profile', file);
        
        const result = await Api.patchFileUpload(`users/${user.id}`, formData);

        setFile("");
        setUser(user => {
            const newUser = {...user};
            newUser.profile = result.data.profile;
            return newUser;
        });
        setIsEditingFile(false)

      console.log(result);
  };

  const handleImageChange = (e) => {
    !e.target.files[0]? setFileSelected(false) : setFileSelected(true)
    setFile(e.target.files[0]);

  };

  const handleClickCancle = () => {
    setIsEditingFile(false)
    setFileSelected(false);
  }

  //프로필 사진 변경 폼 추가
  return (
    <Grid mb="20px">
      {pathname === "/network" || !isEditable ? (
        ""
      ) : !isEditing ? (
        <IconButton size="string" color="secondary" onClick={() => setIsEditingFile(true)}>
          <ImageRoundedIcon />
        </IconButton>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="userEditPicture" className="mb-3">
            <Form.Label style={{
                  fontFamily: "GmarketSans",
                }}>프로필 사진 변경</Form.Label>
            <Form.Control type="file" onChange={handleImageChange} />
          </Form.Group>

          <Form.Group as={Row} className="mt-3 text-center">
            <Col sm={{ span: 20 }}>
              <Button variant="primary" type="submit" className="me-3"
                disabled={!fileSelected}>
                확인
              </Button>
              <Button
                variant="secondary"
                onClick={handleClickCancle}
              >
                취소
              </Button>
            </Col>
          </Form.Group>
        </Form>
      )}
    </Grid>
  );
}

export default UserFileEditForm;
