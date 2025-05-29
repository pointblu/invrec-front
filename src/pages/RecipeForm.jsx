import { Controller, useFormContext, useWatch } from "react-hook-form";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  getAllInventories,
  createInventory,
  createIngredient,
} from "../services/api";
import {
  CustomInput,
  CustomMultiSelect,
  CustomButton,
  CustomSelect,
} from "../components";
import * as z from "zod";

export const recipeSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .max(100, "Máximo 100 caracteres"),
  measurementUnit: z.string().min(1, "Seleccione una unidad de medida"),
  ingredients: z.array(z.any()).min(1, "Seleccione al menos un ingrediente"),
  averageCost: z.number().min(0, "El costo debe ser ≥ 0"),
});

const parseCurrencyString = (value) => {
  if (!value || typeof value !== "string") return 0;
  const cleanedValue = value
    .replace("$", "")
    .replace(/\./g, "")
    .replace(",", ".");
  return parseFloat(cleanedValue) || 0;
};

export function RecipeForm({ onFormSubmit }) {
  const {
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useFormContext();

  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch de ingredientes
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        setLoading(true);
        const response = await getAllInventories(1, 3000);
        const ingredientsData = response?.data?.result;

        const unitMapping = {
          grams: "Kg",
          liters: "ml",
          units: "Un",
        };

        const formattedIngredients = ingredientsData.map((item) => {
          const friendlyUnit =
            unitMapping[item.measurementUnit] || item.measurementUnit;

          return {
            value: item.id,
            label: `[${friendlyUnit}] ${item.name}`,
            cost: parseFloat(item.cost.replace("$", "").replace(",", "")),
            measurementUnit: item.measurementUnit,
          };
        });

        setAvailableIngredients(formattedIngredients);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching ingredients:", err);
        setError("Error al cargar los ingredientes");
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  const selectedIngredients = useWatch({
    control,
    name: "ingredients",
    defaultValue: [],
  });

  useEffect(() => {
    const totalCost = selectedIngredients?.reduce((sum, ingredient) => {
      return sum + (ingredient.cost || 0) * (ingredient.quantity || 0);
    }, 0);
    setValue("averageCost", totalCost, { shouldValidate: true });
  }, [selectedIngredients, setValue]);

  const onSubmit = async (data) => {
    try {
      const inventoryData = {
        name: data.name,
        description: data.description,
        type: "processed",
        measurementUnit: data.measurementUnit,
        cost: data.averageCost,
      };

      const inventoryResponse = await createInventory(inventoryData);
      const inventoryId = inventoryResponse.data.id;

      const ingredientPromises = data.ingredients.map((ingredient) => {
        const ingredientData = {
          quantity: ingredient.quantity,
          cost: ingredient.cost,
          inventoryId,
          ingredientId: ingredient.product.value,
        };

        return createIngredient(ingredientData);
      });

      await Promise.all(ingredientPromises);
      onFormSubmit();
    } catch (error) {
      console.error("Error en el submit:", error);
      setError("Ocurrió un error al guardar los datos");
    }
  };

  if (loading) return <div>Cargando ingredientes...</div>;
  if (error) return <div>{error}</div>;

  const measurementUnitOptions = [
    { value: "grams", label: "Kilogramos" },
    { value: "liters", label: "Mililitros" },
    { value: "units", label: "Unidades" },
  ];

  const handleClick = () => {
    handleSubmit(onSubmit)();
  };
  // ✅ Sin <form>, porque CustomForm ya lo provee
  return (
    <>
      {/* Columna 1 y 2 dentro del CustomForm */}
      <div>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <CustomInput
              {...field}
              id="name"
              label="Nombre del Producto"
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value)}
              disabled={isSubmitting}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <CustomInput
              {...field}
              id="description"
              label="Descripción"
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value)}
              disabled={isSubmitting}
            />
          )}
        />

        <Controller
          name="measurementUnit"
          control={control}
          render={({ field }) => (
            <CustomSelect
              id="measurementUnit"
              label="Unidad de medida"
              options={measurementUnitOptions}
              value={
                measurementUnitOptions.find(
                  (opt) => opt.value === field.value
                ) || null
              }
              onChange={(option) => field.onChange(option?.value || "")}
              isSearchable={false}
            />
          )}
        />

        <Controller
          name="averageCost"
          control={control}
          render={({ field }) => {
            const formattedValue = new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
            }).format(field.value || 0);

            return (
              <CustomInput
                {...field}
                id="averageCost"
                label="Costo promedio"
                value={formattedValue}
                onChange={(e) => {
                  const parsed = parseCurrencyString(e.target.value);
                  field.onChange(isNaN(parsed) ? 0 : parsed);
                }}
                disabled={isSubmitting}
              />
            );
          }}
        />
      </div>

      <div>
        <CustomMultiSelect
          control={control}
          name="ingredients"
          options={availableIngredients}
          setValue={setValue}
          disabled={isSubmitting}
        />

        <CustomButton
          type="button"
          onClick={handleClick}
          style={{ width: "100%", marginTop: "20px" }}
          disabled={isSubmitting}
        >
          Agregar
        </CustomButton>
      </div>
    </>
  );
}

RecipeForm.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
};
