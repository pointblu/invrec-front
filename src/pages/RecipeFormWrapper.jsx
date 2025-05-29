import { RecipeForm, recipeSchema } from "./RecipeForm";
import { CustomHForm } from "../components";
import PropTypes from "prop-types";

export function RecipeFormWrapper({ onFormSubmit }) {
  return (
    <CustomHForm
      schema={recipeSchema}
      defaultValues={{
        name: "",
        description: "",
        measurementUnit: "",
        ingredients: [],
        averageCost: 0,
      }}
      onSubmit={onFormSubmit}
      buttonTitle="Agregar"
      customWidth="1000px"
      firstColumnWidth="360px"
      twoColumns
    >
      <RecipeForm onFormSubmit={onFormSubmit} />
    </CustomHForm>
  );
}

RecipeFormWrapper.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
};
