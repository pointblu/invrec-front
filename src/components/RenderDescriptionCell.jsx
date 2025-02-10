import PropTypes from "prop-types";
import { DescriptionCell } from "./DescriptionCell";

export function RenderDescriptionCell({ getValue }) {
  return <DescriptionCell value={getValue()} />;
}

RenderDescriptionCell.propTypes = {
  getValue: PropTypes.func.isRequired,
};
