"use client";

import Button from '@/components/common/Button/Button';
import Header from '@/components/common/Header/Header';
import { NoTitleHeader } from '@/components/common/Header/Header.stories';
import Modal from '@/components/common/Modal/Modal';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import styled from 'styled-components';
import FeatureGroup from '@/components/recommend/FeatureGroup/FeatureGroup';
import FeatureTitle from '@/components/recommend/FeatureTitle/FeatureTitle';
import BottomSheet from '@/components/common/BottomSheet/BottomSheet';
import { useTraitStore } from '@/stores/traitStore';
import { getUserQuestions } from '@/apis/traits/getTraits';
import { postPetTraits, registerUserTraits } from '@/apis/traits/postTraits';

const RecommendUserTest = () => {
  return (
    <Suspense>
      <ActualRecommendUserTest />
    </Suspense>
  )
}

const ActualRecommendUserTest = () => {

  const searchParams = useSearchParams();
  const petId = searchParams.get("petId");
  const router = useRouter();
  const { petTraits, setMemberTraits } = useTraitStore();
  const [questions, setQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSavedBottomSheetOpen, setIsSavedBottomSheetOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getUserQuestions();
        console.log(response)
        setQuestions(response.data);
      } catch (error) {
        console.error("보호자 성향 질문 불러오기 실패:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleCheckboxClick = (questionId, answerId) => {
    setSelectedTags((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const isButtonActive = Object.keys(selectedTags).length === questions.length;

  const handleSubmit = async () => {
    const memberTraits = Object.entries(selectedTags).map(([questionId, answerId]) => ({
      traitQuestionId: Number(questionId),
      traitAnswerId: answerId,
    }));
    setMemberTraits(memberTraits);

    try {
      // 서버로 반려견 성향과 보호자 성향 보내기
      await postPetTraits(petId, {petTraitResponseRequestList: petTraits})
      await registerUserTraits({memberTraitResponseRequestList: memberTraits })

      setIsSavedBottomSheetOpen(true);
    } catch (error) {
      console.error("성향 데이터 저장 실패:", error);
    }
  };

  return (
    <Container>
      <Header showX={NoTitleHeader.args.showX} onClose={() => setIsModalOpen(true)} />
      <Content>
        <FeatureTitle title={
          <>
            보호자 님은 <br />어떤 시설을 원하시나요?
          </>
        } />
        {questions.map((question) => (
          <FeatureGroup
            key={question.questionId}
            label={question.content}
            options={question.answers.map((ans) => ans.content)}
            selectedValue={selectedTags[question.questionId]}
            onSelect={(value) => {
              const answerId = question.answers.find((ans) => ans.content === value)?.answerId;
              handleCheckboxClick(question.questionId, answerId);
            }}
          />
        ))}
      </Content>

      <Button 
        isActive={isButtonActive}
        onClick={handleSubmit}
        hasImage
      > 확인
      </Button>

      {isModalOpen && (
        <Modal
          title='성향테스트를 중단하시겠습니까?'
          message={
            <>
              지금까지 작성된 정보는<br />
              저장되지 않습니다.
            </>
          }
          cancelText='나가기'
          confirmText='계속 작성'
          onCancel={() => router.push('/recommend/testresult')}
          onConfirm={() => setIsModalOpen(false)}
        />
      )}

      {isSavedBottomSheetOpen && (
        <StyledBottomSheetWrapper>
          <BottomSheet
            title='성향테스트 정보가 저장되었습니다.'
            cancelText='성향 확인하기'
            confirmText='추천 시설 보기'
            onClose={() => router.push('/recommend/testresult')}
            onConfirm={() => router.push('/recommend')}
          />
        </StyledBottomSheetWrapper>
      )}
    </Container>
  );
};

export default RecommendUserTest;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 50px;
`;

const StyledBottomSheetWrapper = styled.div`
  h2 {
    margin-bottom: 40px; /* 제목과 버튼 사이 간격 */
  }
`;