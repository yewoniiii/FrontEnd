"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import Banner from "@/components/place/Banner/Banner";
import Footer from "@/components/common/Footer/Footer.jsx";
import CategorySelector from "@/components/place/CategorySelector/CategorySelector";
import ReviewList from "@/components/place/ReviewList/ReviewList";
import Image from "next/image";
import Hr from "@/components/place/Hr/Hr";
import Divider from "@/components/common/Divider/Divider";
import theme from "@/styles/theme";

const BottomSheet = dynamic(() => import("@/components/common/BottomSheet/BottomSheet"), { ssr: false });
const categoryMapping = {
  미용: "서비스",
  반려동물용품: "서비스",
  위탁관리: "서비스",
  식당: "음식점",
  카페: "음식점",
  문예회관: "문화시설",
  박물관: "문화시설",
  미술관: "문화시설",
  여행지: "문화시설",
  동물병원: "의료시설",
  동물약국: "의료시설",
};
const PlacePage = () => {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();
  const [popularReviews, setPopularReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const fetchPopularReviews = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://api.daengplace.com/reviews/popular");
        setPopularReviews(response.data.data);
      } catch (error) {
        console.error("Failed to fetch popular reviews:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchPopularReviews();
  }, []);
  useEffect(() => {
    if (selectedCategory === "전체") {
      setFilteredReviews(popularReviews); 
    } else {
      const matchingCategories = Object.keys(categoryMapping).filter(
        (key) => categoryMapping[key] === selectedCategory
      );
  
      const filtered = popularReviews.filter((review) =>
        matchingCategories.includes(review.category)
      );
  
      setFilteredReviews(filtered);
    }
  }, [selectedCategory, popularReviews]);
  if (!hasMounted) {
    return null;
  }
  const handleImageClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          router.push(`/place/placesearch?lat=${latitude}&lng=${longitude}`); 
        },
        () => {
          alert("현재 위치를 가져올 수 없습니다.");
          router.push(`/place/placesearch`); 
        }
      );
    } else {
      alert("Geolocation을 지원하지 않는 브라우저입니다.");
      router.push(`/place/placesearch`);
    }
  };

  const handleImageClick2 = () => {
    router.push(`/recommend`);
  }

  const handleReviewClick = (reviewId, placeId) => {
    router.push(`/reviews/ReviewDetail?reviewId=${reviewId}&placeId=${placeId}`);
  };
  return (
    <Container>
        {loading ? ( 
        <LoadingContainer>
          <Spinner />
          <LoadingText>Loading...</LoadingText>
        </LoadingContainer>
      ) : (
        <>
      <Banner />
      <ImagesSection>
        <ImageWrapper onClick={handleImageClick}>
          <Image
            src="/assets/place/banner3.svg"
            alt="내 주변 동반가능시설"
            width={270}
            height={118}
            layout="responsive"
            style={{
              objectFit: "cover",
              borderRadius: "20px",
            }}
          />
          <OverlayText dark={false}>
            <div>내 주변 동반가능시설</div>
            <div>찾아보기</div>
          </OverlayText>
        </ImageWrapper>
        <ImageWrapper onClick={handleImageClick2}>
          <Image
            src="/assets/place/banner2.svg"
            alt="성향별 추천 시설"
            width={270}
            height={118}
            layout="responsive"
            style={{
              objectFit: "cover",
              borderRadius: "20px",
            }}
          />
          <OverlayText dark={true}>
            <div>성향별 추천 시설</div>
            <div>알아보기</div>
          </OverlayText>
        </ImageWrapper>
      </ImagesSection>

      <CategoryWrapper>
      <CategorySection>
        <h2>카테고리별 <span>인기 리뷰</span> 🔥</h2>
        <CategorySelector
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          hoveredCategory={hoveredCategory}
          setHoveredCategory={setHoveredCategory}
        />
        <Hr />
        <ReviewList reviews={filteredReviews} onClick={handleReviewClick} />
      </CategorySection>
      </CategoryWrapper>
      <Divider />
      <Footer />
      </>
      )}
    </Container>
  );
};

export default PlacePage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width : 100%;
  min-height: 100vh;
  margin: 0 auto;
  background-color: ${theme.colors.defaultBackground};
  position: relative;
`;

const ImagesSection = styled.section`
  display: flex;
  justify-content: center;
  gap: 20px;
  height: 100%;
  position: relative;
  margin: 20px auto;
  padding : 0 1.25rem;
`;

const ImageWrapper = styled.div`
  cursor: pointer;
`;

const OverlayText = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "dark",
})`
  position: absolute;
  top: 10px;
  left: 8px;
  font-size: 16px;
  font-weight: bold;
  color: ${({ dark }) => (dark ? "white" : "black")};
  padding: 5px 10px;

  @media (max-width: 500px) {
    font-size : 10px;
  }
`;

const CategoryWrapper = styled.div`
  padding: 0 1.25rem;
  margin-bottom: 20px;
`
const CategorySection = styled.section`
  background: white;
  padding: 1.25rem;
  border-radius: 1.25rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
  
  h2 {
    margin-bottom: 20px;
    font-size: 20px;
  }
  h2 span {
    color: #0019f4;
  }
`;

const FooterWrapper = styled.div`
  margin-top: 0.75rem;
  width: 100%; 
  padding: 0 1.25rem;
`;
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const LoadingText = styled.p`
  margin-top: 10px;
  font-size: 18px;
  font-weight: bold;
  color: #0019f4;
`;
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;
const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #0019f4;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;