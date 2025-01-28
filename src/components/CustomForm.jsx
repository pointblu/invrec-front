import styled from "styled-components";
import PropTypes from "prop-types";

export const CustomForm = ({ children, onSubmit }) => {
  return (
    <Form autocomplete="off" onSubmit={onSubmit}>
      {children}
    </Form>
  );
};

CustomForm.propTypes = {
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func,
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 360px;
  background: ${({ theme }) => theme.bg2};
  padding: 15px;
  margin: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;
