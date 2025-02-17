import styled from "styled-components";
import PropTypes from "prop-types";

export const CustomButton = ({ children, onClick, type = "button", icon }) => {
  return (
    <Button type={type} onClick={onClick}>
      {icon && <IconWrapper>{icon}</IconWrapper>}
      {children}
    </Button>
  );
};

CustomButton.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  icon: PropTypes.node,
};

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: ${({ icon }) => (icon ? "flex-start" : "center")};
  gap: ${({ icon }) => (icon ? "8px" : "0px")};
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

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  font-size: 18px; /* Tamaño del icono */
  color: ${({ theme }) => theme.bg2};
`;
