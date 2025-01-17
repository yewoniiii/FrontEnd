"use client";

import React from "react";
import styled from "styled-components";

const SubHeader = ({ category, title }) => {
  return (
    <Wrapper>
      <CategoryBadge>{category}</CategoryBadge>
      <Title>{title}</Title>
      <StyledDivider />
    </Wrapper>
  );
};

export default SubHeader;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 50px;
  margin-left: 20px;
`;

const CategoryBadge = styled.div`
  display: inline-block;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: bold;
  color: #fff;
  background: #01003f;
  border-radius: 10px;
  text-align: center;
  margin-top: 20px;
`;

const Title = styled.h2`
  margin-top: 10px;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;
const StyledDivider = styled.div`
  width: 95%; 
  height: 1px; 
  background-color: #ABABAB; 
  margin-top: 10px; 
  margin-bottom: 10px; 
`;
