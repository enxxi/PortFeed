import React, { useState } from "react";
import { Button, Form, Card, Col, Row } from "react-bootstrap";
import * as Api from "../../lib/apis/api";
import { FormHelperText } from "@mui/material";

function UserEditForm({ user, setIsEditing, setUser }) {
  //useState로 name 상태를 생성함.
  const [name, setName] = useState(user.name);
  //useState로 email 상태를 생성함.
  const [email, setEmail] = useState(user.email);
  //useState로 description 상태를 생성함.
  const [description, setDescription] = useState(user.description);

  const [isValidName, setIsValidName] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidDescription, setIsValidDescription] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // "users/유저id" 엔드포인트로 PUT 요청함.
    try {
      const res = await Api.put(`users/${user.id}`, {
        name,
        email,
        description,
      }).catch((err) => {
        console.log(err);
        throw new Error(err.response.data.error);
      });
      // 유저 정보는 response의 data임.
      const updatedUser = res.data;
      // 해당 유저 정보로 user을 세팅함.
      setUser(updatedUser);

      // isEditing을 false로 세팅함.
      setIsEditing(false);
    } catch (err) {
      alert(err);
    }
  };

  const validateName = (name) => {
    return name.replaceAll(" ", "") ? true : false;
  };
  const validateEmail = (email) => {
    return email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  const validateDescription = (description) => {
    return description.length < 20;
  };

  const handleChangeName = (e) => {
    console.log(isValidName);
    setName(e.target.value);
    setIsValidName(validateName(e.target.value));
  };
  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
    setIsValidEmail(validateEmail(e.target.value));
  };
  const handleChangeDescription = (e) => {
    setDescription(e.target.value);
    setIsValidDescription(validateDescription(e.target.value));
  };

  return (
    <Card className="mb-2">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="useEditName" className="mb-3">
            <Form.Control
              type="text"
              placeholder="이름"
              value={name}
              onChange={handleChangeName}
              style={{ fontFamily: "GmarketSans" }}
            />
            {!isValidName && (
              <FormHelperText>이름을 작성해주세요.</FormHelperText>
            )}
          </Form.Group>

          <Form.Group controlId="userEditEmail" className="mb-3">
            <Form.Control
              type="email"
              placeholder="이메일"
              value={email}
              style={{ fontFamily: "GmarketSans" }}
              onChange={handleChangeEmail}
            />
            {!isValidEmail && (
              <FormHelperText>이메일 형식에 맞게 작성해주세요.</FormHelperText>
            )}
          </Form.Group>

          <Form.Group controlId="userEditDescription">
            <Form.Control
              type="text"
              placeholder="정보, 인사말"
              value={description}
              onChange={handleChangeDescription}
              style={{ fontFamily: "GmarketSans" }}
            />
            {!isValidDescription && (
              <FormHelperText>20자 이내로 작성해주세요.</FormHelperText>
            )}
          </Form.Group>

          <Form.Group as={Row} className="mt-3 text-center">
            <Col sm={{ span: 20 }}>
              <Button
                variant="primary"
                type="submit"
                className="me-3"
                style={{
                  fontFamily: "GmarketSans",
                  borderRadius: "30px",
                  backgroundColor: "#117864",
                }}
                disabled={!isValidName || !isValidEmail || !isValidDescription}
              >
                확인
              </Button>
              <Button
                variant="secondary"
                style={{ fontFamily: "GmarketSans", borderRadius: "30px" }}
                onClick={() => setIsEditing(false)}
              >
                취소
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default UserEditForm;
