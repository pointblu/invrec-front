import { useState, forwardRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

export const CustomInput = forwardRef(function CustomInput(
  {
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
    readOnly,
    min,
    disabled,
  },
  ref // Añadimos el ref aquí
) {
  const [visible, setVisible] = useState(false);

  const handleToggleVisibility = () => setVisible(!visible);

  const handleChange = (e) => {
    if (type === "number" && e.target.value < 0) {
      // Si el valor es negativo, no se actualiza el estado
      return;
    }
    onChange(e); // Llama a la función onChange proporcionada por el padre
  };

  return (
    <InputContainer $maxWidth={maxWidth}>
      <Input
        type={isPassword && visible ? "text" : type}
        id={id}
        name={id}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        ref={ref}
        required
        autoComplete="off"
        readOnly={readOnly}
        min={min}
        disabled={disabled}
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
});

// Validación de PropTypes
CustomInput.propTypes = {
  type: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.element,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  toggleVisibilityIcon: PropTypes.shape({
    visible: PropTypes.element.isRequired,
    hidden: PropTypes.element.isRequired,
  }),
  isPassword: PropTypes.bool,
  maxWidth: PropTypes.string,
  readOnly: PropTypes.bool,
  min: PropTypes.number,
  disabled: PropTypes.bool,
};

// Estilos
const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  max-width: ${({ $maxWidth }) => $maxWidth || "100%"};
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 10px 10px 10px;
  value:${({ value }) => value || ""}
  ref={ref}
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
    font-size: 11px;
    color: ${({ theme }) => theme.primary};
  }
`;

const Label = styled.label`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 14px;
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
