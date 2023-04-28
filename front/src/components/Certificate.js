import React, { useState } from "react";
import * as Api from "../api";

// props 로 User의 정보를 가져온다
// isEditable => 본인의 포트폴리오인지 상태값
// certificateData => 해당 유저의 학력정보
export function Certificate({ isEditable, certificateData }) {
  // props로 가져온 certificateData 를 상태값으로 선언한다.
  const [certificate, setCertificate] = useState(certificateData);

  console.log(
    "isEditable: ",
    isEditable,
    "\n",
    "certificateData: ",
    certificateData,
    "\n"
  );

  // 자격증 작성중인지 상태값 선언
  const [isCreating, setIsCreating] = useState(false);

  // 자격증 추가 시 input 값 state 선언
  const [certification, setCertification] = useState("");
  const [organization, setOrganization] = useState("");

  // certification 값 공백만 입력시 추가버튼 클릭불가처리, 기관은 필수값 아님
  const isFormValid = certification.replaceAll(" ", "");

  // 자격증 추가
  const addCertificate = async () => {
    try {
      // certificate 주소(임시주소)로 post 요청을 보낸다. **** 백엔드 구성완료시 주석해제
      // await Api.post("certificate", { certification, organization });

      // 학력상태값도 갱신하며 컴포넌트를 재렌더링한다.
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

  return (
    <div>
      <h1>자격증</h1>

      {
        /* certificateData 길이 만큼 순환하여 출력 */
        certificate.length > 0 &&
        certificate.map((item, idx) => (
            <div key={idx}>
              {item.certification} {item.organization}
              {isEditable && (
                <button onClick={() => removeCertificate(idx)}>삭제</button>
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
              placeholder="자격종류"
              value={certification}
              onChange={(e) => setCertification(e.target.value)}
            />
            <input
              type="text"
              placeholder="발급기관"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
            />
            <button onClick={addCertificate} disabled={!isFormValid}>
              추가
            </button>
            <button onClick={() => setIsCreating(!isCreating)}>취소</button>
          </>
        )
      }
    </div>
  );
}
