import styled from "styled-components";

export const GridContainer = styled.div`
  max-height: 60vh;
  overflow-y: auto;
  padding: 16px;
  background-color: #f0f2f5;
  border-radius: 8px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;
  margin: -8px; // Negative margin to counteract the grid gap

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const ImageContainer = styled.div`
  position: relative;
  aspect-ratio: 1;
`;

export const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  transition: opacity 0.3s ease;
  cursor: pointer;

  ${({ isSelected }) =>
    isSelected &&
    `
    opacity: 0.7;
  `}
`;

export const CheckIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #1890ff;
  font-size: 48px;
  opacity: 0.9;
`;

export const SelectedAvatars = styled.div`
  margin-top: 16px;
  font-size: 16px;
  font-weight: bold;
`;
