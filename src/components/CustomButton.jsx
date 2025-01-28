import styled from "styled-components";
import PropTypes from "prop-types";

export const CustomButton = ({ children, onClick, type = "button" }) => {
  return (
    <Button type={type} onClick={onClick}>
      {children}
    </Button>
  );
};

CustomButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
};

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.bg};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
  }
`;
