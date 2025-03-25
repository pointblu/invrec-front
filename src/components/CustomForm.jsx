import styled from "styled-components";
import PropTypes from "prop-types";

export const CustomForm = ({
  children,
  onSubmit,
  customWidth,
  twoColumns,
  firstColumnWidth,
}) => {
  return (
    <Form
      autoComplete="off"
      onSubmit={onSubmit}
      $customWidth={customWidth}
      $twoColumns={twoColumns}
      $firstColumnWidth={firstColumnWidth}
    >
      {children}
    </Form>
  );
};

CustomForm.propTypes = {
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func,
  customWidth: PropTypes.string,
  twoColumns: PropTypes.bool,
  firstColumnWidth: PropTypes.string,
};

const Form = styled.form`
  display: flex;
  flex-direction: ${({ $twoColumns }) => ($twoColumns ? "row" : "column")};
  gap: 10px;
  width: ${({ $customWidth }) =>
    $customWidth || "360px"}; /* Ancho más grande */
  background: ${({ theme }) => theme.bg2};
  padding: 15px;
  margin: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  ${({ $twoColumns, $firstColumnWidth }) =>
    $twoColumns &&
    `
  > div:first-child {
    width: ${$firstColumnWidth || "360px"}; // Ancho de la primera columna
     display: flex;
     flex-direction: column;
     gap: 20px;
  }

  > div:last-child {
    flex: 1; // La segunda columna ocupa el resto del espacio
     display: flex;
     flex-direction: column;
     gap: 10px;
  }
`}
`;
