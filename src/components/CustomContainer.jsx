import styled from "styled-components";
import PropTypes from "prop-types";

export const CustomContainer = ({ children }) => {
  return <Container>{children}</Container>;
};

CustomContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: top;
  align-items: center;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  font-family: Arial, sans-serif;
`;
