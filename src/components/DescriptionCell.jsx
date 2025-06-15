import styled from "styled-components";
import PropTypes from "prop-types";

export function DescriptionCell({ value }) {
  return <StyledDescription data-tooltip={value}>{value}</StyledDescription>;
}

DescriptionCell.propTypes = {
  value: PropTypes.string.isRequired,
};

const StyledDescription = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  will-change: max-width, transform;

  &:hover {
    content: attr(data-tooltip);
    overflow: visible;
    white-space: normal;
    background: ${({ theme }) => theme.bg2};
    position: absolute;
    z-index: 10;
    padding: 5px;
    border-radius: 5px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    min-width: 300px;
    max-width: 600px;
    width: auto;
    transform: translateZ(0);
    border: 1px solid #ddd;
  }
`;
