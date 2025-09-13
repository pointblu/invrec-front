import { RecipeForm, recipeSchema } from "./RecipeForm";
import { CustomHForm } from "../components";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { getInventoryById } from "../services/api";

export function RecipeFormWrapper({ onFormSubmit, initialData }) {
  const [defaultValues, setDefaultValues] = useState({
    name: "",
    description: "",
    measurementUnit: "",
    ingredients: [],
    averageCost: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      if (initialData?.id) {
        setIsLoading(true);
        try {
          // Obtener los detalles completos del inventario con ingredientes
          const response = await getInventoryById(initialData.id);
          const inventoryData = response.data;
          
          // Formatear los ingredientes existentes para el formulario
          const formattedIngredients = inventoryData.ingredients?.map((ing) => ({
            id: `existing-${ing.id}`, // Marcar como existente
            product: {
              value: ing.ingredient.id,
              label: `[${ing.ingredient.measurementUnit === 'grams' ? 'Kg' : ing.ingredient.measurementUnit === 'liters' ? 'ml' : 'Un'}] ${ing.ingredient.name}`,
              cost: parseFloat(ing.ingredient.cost.replace("$", "").replace(",", "")),
              measurementUnit: ing.ingredient.measurementUnit,
            },
            quantity: parseFloat(ing.quantity),
            cost: parseFloat(ing.ingredient.cost.replace("$", "").replace(",", "")),
            existingId: ing.id, // ID del ingrediente existente para actualizaciones/eliminaciones
          })) || [];

          setDefaultValues({
            name: inventoryData.name || "",
            description: inventoryData.description || "",
            measurementUnit: inventoryData.measurementUnit || "",
            ingredients: formattedIngredients,
            averageCost: parseFloat(inventoryData.cost?.replace("$", "").replace(",", "")) || 0,
          });
        } catch (error) {
          console.error("Error loading initial data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadInitialData();
  }, [initialData]);

  if (isLoading) {
    return <div>Cargando datos...</div>;
  }

  return (
    <CustomHForm
      schema={recipeSchema}
      defaultValues={defaultValues}
      onSubmit={onFormSubmit}
      buttonTitle={initialData?.id ? "Actualizar" : "Agregar"}
      customWidth="1000px"
      firstColumnWidth="360px"
      twoColumns
    >
      <RecipeForm onFormSubmit={onFormSubmit} initialData={initialData} />
    </CustomHForm>
  );
}

RecipeFormWrapper.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};
