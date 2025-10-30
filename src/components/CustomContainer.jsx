import styled from "styled-components";
import PropTypes from "prop-types";

export const CustomContainer = ({ children, padding = "0.5rem" }) => {
  return <Container $padding={padding}>{children}</Container>;
};

CustomContainer.propTypes = {
  children: PropTypes.node.isRequired,
  padding: PropTypes.string,
};

const Container = styled.div`
  height: 100vh;
  box-sizing: border-box;
  padding: ${({ $padding }) => $padding || "0"};
  display: flex;
  flex-direction: column;
  justify-content: top;
  align-items: center;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  font-family: Arial, sans-serif;
  overflow-y: auto;
  overflow-x: hidden;

  h1 {
    position: fixed;
    z-index: 999;
    margin-top: -3.5rem;
  }
`;
