import styled from "styled-components";
import PropTypes from "prop-types";

export const CustomSubContainer = ({ children, align = "left" }) => {
  return <Container align={align}>{children}</Container>;
};

CustomSubContainer.propTypes = {
  children: PropTypes.node.isRequired,
  align: PropTypes.oneOf(["left", "center", "right"]),
};

const Container = styled.div`
  width: 97%;
  display: flex;
  padding: 1rem;
  flex-direction: row;
  justify-content: ${({ align }) =>
    align === "left"
      ? "flex-start"
      : align === "center"
      ? "center"
      : "flex-end"};
  align-items: center;
  gap: 10px;
  background-color: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text};
  font-family: Arial, sans-serif;
  border-radius: 10px;
`;
