import React, { useState } from "react";
import { useLocation  } from 'react-router-dom';
import { Button, Form, Card, Col, Row } from "react-bootstrap";
import * as Api from "../../api";

function UserFileEditForm({ user, setIsEditing, setUser, isEditable }) {
    const [file, setFile] = useState();
    const [isEditing, setIsEditingFile] = useState(false);
    const {pathname} = useLocation();
    console.log(isEditable)
    const user_id = user?._id;

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(file);
        
        const formData = new FormData();
        formData.append('profile', file);
        
        const result = await Api.patchFileUpload(`users/${user_id}`, formData);

        // result.data =data;
        // setFile(result.data);
        /* setUser({
            ..., profile: result.data
        }); */
        
        console.log(result);
    }

    const handleImageChange = e => {
        setFile(e.target.files[0]);
    }


  //프로필 사진 변경 폼 추가
  return (
    <>
    {pathname === "/network" || !isEditable
    ? ""
    : !isEditing
        ? <Button onClick={() => setIsEditingFile(true)}>변경</Button>
        : <Form onSubmit={handleSubmit}>
            <Form.Group controlId="userEditPicture" className="mb-3">
            <Form.Label>프로필 사진</Form.Label>
            <Form.Control type="file" onChange={handleImageChange} />
            </Form.Group>

            <Form.Group as={Row} className="mt-3 text-center">
            <Col sm={{ span: 20 }}>
                <Button variant="primary" type="submit" className="me-3">
                확인
                </Button>
                <Button variant="secondary" onClick={() => setIsEditingFile(false)}>
                취소
                </Button>
            </Col>
        </Form.Group>
  </Form>}
    

    
  </>
  );
}

export default UserFileEditForm;
