import styled, { css } from "styled-components";
import PropTypes from "prop-types";

export const CustomButton = ({
  children,
  onClick,
  type = "button",
  icon,
  customStyle,
}) => {
  return (
    <Button type={type} onClick={onClick} $customStyle={customStyle}>
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
  customStyle: PropTypes.shape({
    default: PropTypes.object,
    hover: PropTypes.object,
    active: PropTypes.object,
  }),
};

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: ${({ icon }) => (icon ? "flex-start" : "center")};
  gap: ${({ icon }) => (icon ? "8px" : "0px")};
  padding: 8px;
  font-size: 14px;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.bg};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  /* Estilos personalizados (si se proporcionan) */
  ${({ $customStyle }) =>
    $customStyle?.default &&
    css`
      ${$customStyle.default}
    `}

  /* Hover por defecto del componente base */
  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};

    /* Hover personalizado (si se proporciona) */
    ${({ $customStyle }) =>
      $customStyle?.hover &&
      css`
        ${$customStyle.hover}
      `}
  }
  &:active {
    background-color: ${({ theme }) => theme.primaryActive};

    /* Active personalizado (si se proporciona) */
    ${({ $customStyle }) =>
      $customStyle?.active &&
      css`
        ${$customStyle.active}
      `}
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  font-size: 16px; /* Tamaño del icono */
  color: inherit;
`;
