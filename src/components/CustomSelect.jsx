import { useState, forwardRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Select from "react-select";

export const CustomSelect = forwardRef(function CustomSelect(
  {
    id,
    label,
    options,
    placeholder = "",
    value,
    onChange,
    maxWidth,
    isMulti = false,
    isSearchable = true,
    isClearable = false,
    isLoading = false,
    isDisabled = false,
  },
  ref
) {
  const [isFocused, setIsFocused] = useState(false);

  // Determina si el label debe flotar
  const shouldLabelFloat = !!value || isFocused;

  return (
    <SelectContainer $maxWidth={maxWidth}>
      <StyledSelect
        id={id}
        options={options}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        isMulti={isMulti}
        isSearchable={isSearchable}
        isClearable={isClearable}
        isLoading={isLoading}
        isDisabled={isDisabled}
        ref={ref}
        classNamePrefix="select"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <Label htmlFor={id} $float={shouldLabelFloat}>
        {label}
      </Label>
    </SelectContainer>
  );
});

// Validación de PropTypes
CustomSelect.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func.isRequired,
  maxWidth: PropTypes.string,
  isMulti: PropTypes.bool,
  isSearchable: PropTypes.bool,
  isClearable: PropTypes.bool,
  isLoading: PropTypes.bool,
  isDisabled: PropTypes.bool,
};

// Estilos
const SelectContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  max-width: ${({ $maxWidth }) => $maxWidth || "100%"};
`;

const StyledSelect = styled(Select)`
  width: 100%;
  font-size: 16px;
  border: 1px solid ${({ theme }) => theme.text};
  border-radius: 5px;
  outline: none;
  background: transparent;
  transition: border 0.3s;
  color: ${({ theme }) => theme.text};

  .select__control {
    background: transparent;
    border: none;
    box-shadow: none;
    &:hover {
      border-color: ${({ theme }) => theme.primary};
    }
  }

  .select__menu {
    background: ${({ theme }) => theme.bg2};
    color: ${({ theme }) => theme.text};
  }

  .select__option {
    &:hover {
      background: ${({ theme }) => theme.primary};
      color: ${({ theme }) => theme.bg2};
    }
  }

  .select__single-value {
    color: ${({ theme }) => theme.text};
  }

  .select__placeholder {
    color: ${({ theme }) => theme.text};
    opacity: ${({ $hasValue }) => ($hasValue ? 0 : 1)};
    transition: opacity 0.3s;
  }

  .select__indicator-separator {
    background-color: ${({ theme }) => theme.text};
  }

  .select__dropdown-indicator {
    color: ${({ theme }) => theme.text};
    &:hover {
      color: ${({ theme }) => theme.primary};
    }
  }

  .select__clear-indicator {
    color: ${({ theme }) => theme.text};
    &:hover {
      color: ${({ theme }) => theme.primary};
    }
  }

  &:focus {
    border-color: ${({ theme }) => theme.primary};
  }
`;

const Label = styled.label`
  position: absolute;
  top: ${({ $float }) => ($float ? "-10px" : "10px")};
  left: 10px;
  font-size: ${({ $float }) => ($float ? "12px" : "16px")};
  color: ${({ theme, $float }) => ($float ? theme.primary : theme.text)};
  pointer-events: none;
  transition: all 0.3s;
  background: ${({ theme }) => theme.bg2};
  padding: 0 5px;
`;
