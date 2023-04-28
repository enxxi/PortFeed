import React, { useState } from "react";
import * as Api from "../api";

// props 로 User의 정보를 가져온다
// isEditable => 본인의 포트폴리오인지 상태값
// awardData => 해당 유저의 수상정보
export function Award({ isEditable, awardData }) {
// props로 가져온 educationData 를 상태값으로 선언한다.
const [award, setAward] = useState(awardData);

console.log(
    "isEditable: ",
    isEditable,
    "\n",
    "awardData: ",
    awardData,
    "\n"
);

// 수상이력 작성중인지 상태값 선언
const [isCreating, setIsCreating] = useState(false);

// 수상추가 시 input 값 state 선언
const [awarddate, setAwarddate] = useState("");
const [awarded, setAwarded] = useState("");


// awarddate, awarded 모두 입력이 되어야지 추가 버튼이 활성화된다
const isFormValid = () => {
    const isAwarddate = awarddate.trim() !== ''; 
    const isAwarded =  awarded.trim() !== '';
    return isAwarddate && isAwarded;
};

// 학력 추가
const addAward = async () => {
    try {
    // award 주소(임시주소)로 post 요청을 보낸다. **** 백엔드 구성완료시 주석해제
    // await Api.post("award", { awarddate, awarded });

    // 수상값도 갱신하며 컴포넌트를 재렌더링한다.
    setAward((award) => {
        const newAward = [...award];
        newAward.push({ awarddate, awarded });
        return newAward;
    });

    setAwarddate("");
    setAwarded("");
    } catch (err) {
    console.log(err);
    }
};

//학력 삭제
const removeAward = async (idx) => {
    if (window.confirm("삭제 하시겠습니까?")) {
    try {
        // award/idx 주소(임시주소)로 delete 요청을 보낸다.   **** 백엔드 구성완료시 주석해제
        // await Api.delete("education", idx);

        // 수상값도 갱신하며 컴포넌트를 재렌더링한다.
        setAward((award) => {
        const newAward = [...award];
        newAward.splice(idx, 1);
        return newAward;
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
    <h1>수상이력</h1>

    {
        /* awardData 길이 만큼 순환하여 출력 */
        award.length > 0 &&
        award.map((item, idx) => (
            <div key={idx}>
            {item.awarddate} {item.awarded}
            {isEditable && (
                <button onClick={() => removeAward(idx)}>삭제</button>
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
            placeholder="수상날짜 0000-00-00"
            value={awarddate}
            onChange={(e) => setAwarddate(e.target.value)}
            />
            <input
            type="text"
            placeholder="수상명"
            value={awarded}
            onChange={(e) => setAwarded(e.target.value)}
            />
            <button onClick={addAward} disabled={!isFormValid()}>
            추가
            </button>
            <button onClick={() => setIsCreating(!isCreating)}>취소</button>
        </>
        )
    }
    </div>
);
}
