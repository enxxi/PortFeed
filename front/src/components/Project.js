import React, { useState } from "react";
import * as Api from "../api";

// props 로 User의 정보를 가져온다
// isEditable => 본인의 포트폴리오인지 상태값
// projectData => 해당 유저의 프로젝트 정보
export function Project({ isEditable, projectData }) {
  // props로 가져온 projectData 를 상태값으로 선언한다.
  const [project, setProject] = useState(projectData);

  console.log(
    "isEditable: ",
    isEditable,
    "\n",
    "projectData: ",
    projectData,
    "\n"
  );

  // 프로젝트 작성중인지 상태값 선언
  const [isCreating, setIsCreating] = useState(false);

  // 프로젝트 추가 시 input 값 state 선언
  const [projectitem, setProjectitem] = useState("");
  const [description, setDescription] = useState("");

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

        // 학력상태값도 갱신하며 컴포넌트를 재렌더링한다.
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

  return (
    <div>
      <h1>프로젝트</h1>

      {
        /* projectData 길이 만큼 순환하여 출력 */
        project.length > 0 &&
          project.map((item, idx) => (
            <div key={idx}>
              {item.projectitem} {item.description}
              {isEditable && (
                <button onClick={() => removeProject(idx)}>삭제</button>
              )}
            </div>
          ))
      }
      {
        /* 본인의 상세페에지이며, 작성중이 아닐시 + 버튼 출력 */
        isEditable && !isCreating && (
          <button onClick={() => setIsCreating(!isCreating)}> + </button>
        )
      }
      {
        /* 작성중일 시 input 출력 */
        isCreating && (
          <>
            <input
              type="text"
              placeholder="프로젝트명"
              value={projectitem}
              onChange={(e) => setProjectitem(e.target.value)}
            />
            <input
              type="text"
              placeholder="프로젝트 내용"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button onClick={addProject} disabled={!isFormValid}>
              추가
            </button>
            <button onClick={() => setIsCreating(!isCreating)}>취소</button>
          </>
        )
      }
    </div>
  );
}
