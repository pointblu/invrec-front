import { Controller, useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import {
  CustomHForm,
  CustomInput,
  CustomMultiSelect,
  CustomButton,
} from "../components";
import PropTypes from "prop-types";
import data from "../inventories_data.json";
import { useEffect } from "react";

// Esquema de validación con Zod
const ingredientSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  quantity: z.number().min(0, "La cantidad debe ser mayor o igual a 0"),
  measureId: z.string().min(1, "La unidad de medida es requerida"),
  cost: z.number().min(0, "El costo debe ser mayor o igual a 0"),
});

const recipeSchema = z.object({
  code: z.string().min(1, "El código es requerido"),
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().max(10, "La descripción no debe exceder 10 palabras"),
  stock: z.number().min(0, "Las existencias deben ser mayor o igual a 0"),
  measurementUnit: z.string().min(1, "La unidad de medida es requerida"),
  ingredients: z
    .array(ingredientSchema)
    .min(1, "Debe agregar al menos un ingrediente"),
  averageCost: z
    .number()
    .min(0, "El costo promedio debe ser mayor o igual a 0"),
});
export function RecipeForm({ onFormSubmit }) {
  const { control, setValue } = useForm();

  // Obtener los ingredientes disponibles
  const availableIngredients = data.map((item) => ({
    value: item.id, // Valor que se almacenará en el formulario
    label: `[${item.measureId}] ${item.name}`, // Texto que se mostrará en el select
    cost: parseFloat(item.cost.replace("$", "").replace(",", "")), // Costo del ingrediente
    measureId: item.measureId, // Unidad de medida
  }));

  // Observar cambios en el campo "ingredients"
  const selectedIngredients = useWatch({
    control,
    name: "ingredients",
    defaultValue: [], // Asegurar que el valor inicial sea un array vacío
  });

  const averageCostValue = useWatch({ control, name: "averageCost" });
  // Calcular el costo promedio cuando cambien los ingredientes seleccionados
  useEffect(() => {
    const totalCost = selectedIngredients?.reduce((sum, ingredient) => {
      // Calcular el costo total del ingrediente (costo unitario * cantidad)
      return sum + (ingredient.cost || 0) * (ingredient.quantity || 0);
    }, 0);
    const formattedCost = totalCost
      ? `$ ${totalCost.toLocaleString("es-AR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "$ 0,00";

    setValue("averageCost", formattedCost, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [selectedIngredients, setValue, averageCostValue]);

  const onSubmit = (data) => {
    console.log("Datos del formulario:", data);
    onFormSubmit();
  };
  return (
    <CustomHForm
      schema={recipeSchema}
      defaultValues={{
        name: "",
        description: "",
        stock: 0,
        measurementUnit: "",
        image: null,
        ingredients: [],
        averageCost: 0,
      }}
      onSubmit={onSubmit}
      buttonTitle="Agregar"
      customWidth="1000px" // Ajusta el ancho del formulario
      firstColumnWidth="360px"
      twoColumns
    >
      {/* Columna 1 */}
      <div>
        {/* Campo: Nombre */}
        <Controller
          name="name"
          render={({ field }) => (
            <CustomInput
              {...field}
              id="name"
              label="Nombre del Producto"
              placeholder=" " // Placeholder siempre es " "
              value={field.value || ""} // Asegurar que value no sea undefined
              onChange={field.onChange} // Pasar onChange directamente
            />
          )}
        />

        {/* Campo: Descripción */}
        <Controller
          name="description"
          render={({ field }) => (
            <CustomInput
              {...field}
              id="description"
              label="Descripción"
              placeholder=" " // Placeholder siempre es " "
              value={field.value || ""} // Asegurar que value no sea undefined
              onChange={field.onChange} // Pasar onChange directamente
            />
          )}
        />

        {/* Campo: Unidad de medida */}
        <Controller
          name="measurementUnit"
          render={({ field }) => (
            <CustomInput
              {...field}
              id="measurementUnit"
              label="Unidad"
              placeholder=" " // Placeholder siempre es " "
              value={field.value || ""} // Asegurar que value no sea undefined
              onChange={field.onChange} // Pasar onChange directamente
            />
          )}
        />

        {/* Campo: Costo promedio */}

        <Controller
          name="averageCost"
          control={control}
          render={({ field }) => (
            <CustomInput
              {...field}
              id="averageCost"
              label="Costo promedio"
              placeholder=" "
              value={field.value || ""}
              onChange={(e) => {
                field.onChange(e);
              }}
            />
          )}
        />
      </div>

      {/* Columna 2 */}
      <div>
        {/* Campo: Ingredientes */}
        <CustomMultiSelect
          control={control}
          name="ingredients"
          options={availableIngredients}
          setValue={setValue}
        />

        <CustomButton
          type="submit"
          style={{ width: "100%", marginTop: "20px" }}
        >
          Agregar
        </CustomButton>
      </div>
    </CustomHForm>
  );
}
RecipeForm.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
};
