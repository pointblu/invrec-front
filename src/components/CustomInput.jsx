import { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

export function CustomInput({
  type = "text",
  id,
  label,
  icon,
  placeholder = " ",
  value,
  onChange,
  toggleVisibilityIcon,
  isPassword = false,
  maxWidth,
}) {
  const [visible, setVisible] = useState(false);

  const handleToggleVisibility = () => setVisible(!visible);

  return (
    <InputContainer $maxWidth={maxWidth}>
      <Input
        type={isPassword && visible ? "text" : type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        autoComplete="off"
      />
      <Label htmlFor={id}>{label}</Label>
      {icon && <Icon>{icon}</Icon>}
      {isPassword && toggleVisibilityIcon && (
        <IconButton
          onClick={handleToggleVisibility}
          aria-label="Toggle Password Visibility"
        >
          {visible ? toggleVisibilityIcon.visible : toggleVisibilityIcon.hidden}
        </IconButton>
      )}
    </InputContainer>
  );
}

// Validación de PropTypes
CustomInput.propTypes = {
  type: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.element,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  toggleVisibilityIcon: PropTypes.shape({
    visible: PropTypes.element.isRequired,
    hidden: PropTypes.element.isRequired,
  }),
  isPassword: PropTypes.bool,
  maxWidth: PropTypes.string,
};

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  max-width: ${({ $maxWidth }) => $maxWidth || "100%"};
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 40px 10px 10px;
  font-size: 16px;
  border: 1px solid ${({ theme }) => theme.text};
  border-radius: 5px;
  outline: none;
  background: transparent;
  transition: border 0.3s;
  color: ${({ theme }) => theme.text};

  &:focus {
    border-color: ${({ theme }) => theme.primary};
  }

  &:focus + label,
  &:not(:placeholder-shown) + label {
    top: -10px;
    font-size: 12px;
    color: ${({ theme }) => theme.primary};
  }
`;

const Label = styled.label`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 16px;
  color: ${({ theme }) => theme.text};
  pointer-events: none;
  transition: all 0.3s;
  background: ${({ theme }) => theme.bg2};
`;

const Icon = styled.div`
  position: absolute;
  right: 10px;
  color: ${({ theme }) => theme.text};
`;

const IconButton = styled.button`
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;
