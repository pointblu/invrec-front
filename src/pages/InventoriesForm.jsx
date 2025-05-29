import { Controller } from "react-hook-form";
import * as z from "zod";
import {
  CustomHForm,
  CustomInput,
  CustomButton,
  CustomSelect,
} from "../components";
import PropTypes from "prop-types";
import { createInventory } from "../services/api";
import { useState } from "react";

// Esquema de validación con Zod
const baseSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z
    .string()
    .max(100, "La descripción no debe exceder 100 caracteres"),
  type: z.string().min(1, "El tipo es requerido"),
  measurementUnit: z.string().min(1, "La unidad de medida es requerida"),
});

const formatCurrencyInput = (value) => {
  if (!value) return "$ ";

  // Limpia el valor (permite solo números y una coma)
  const cleanValue = value.replace(/[^\d,]/g, "").replace(/(,.*?),/g, "$1");

  // Separa parte entera y decimal
  const parts = cleanValue.split(",");
  let integerPart = parts[0].replace(/\D/g, "") || "";
  let decimalPart = parts[1] ? parts[1].replace(/\D/g, "").substring(0, 2) : "";

  // Agrega separadores de miles
  if (integerPart.length > 3) {
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // Construye el resultado
  let result = `$ ${integerPart}`;
  if (cleanValue.includes(",")) {
    result += decimalPart ? `,${decimalPart}` : ",";
  }

  return result;
};

// Parsea a número (ej: "$ 1.234.567,89" → 1234567.89)
const parseCurrencyInput = (formattedValue) => {
  if (!formattedValue || formattedValue === "$ ") return "";

  const numericString = formattedValue
    .replace("$", "")
    .replace(/\./g, "")
    .replace(",", ".");

  return parseFloat(numericString) || "";
};

export function InventoriesForm({ onFormSubmit, inventoryType }) {
  const [totalInput, setTotalInput] = useState("$ ");
  const [totalValue, setTotalValue] = useState("");
  // Extender el esquema si el tipo es "returned"
  const extendedSchema =
    inventoryType === "returned"
      ? baseSchema.extend({
          cost: z.number().min(0, "El costo debe ser mayor o igual a 0"),
        })
      : baseSchema;

  const handleTotalChange = (e) => {
    const inputValue = e.target.value;

    // Si borró  restablece
    if (inputValue === "" || inputValue === "$") {
      setTotalInput("$ ");
      setTotalValue("");
      return;
    }

    // Manejo especial cuando el usuario está escribiendo decimales
    if (inputValue.includes(",")) {
      const currentFormatted = formatCurrencyInput(inputValue);
      setTotalInput(currentFormatted);

      // Solo actualiza el valor numérico si hay dígitos después de la coma
      if (inputValue.split(",")[1]) {
        setTotalValue(parseCurrencyInput(currentFormatted));
      }
      return;
    }

    // Mantiene el símbolo $ al principio
    let newValue = inputValue.startsWith("$") ? inputValue : `$ ${inputValue}`;

    // Formatea el valor
    const formattedValue = formatCurrencyInput(newValue);
    setTotalInput(formattedValue);

    // Actualiza el valor numérico
    setTotalValue(parseCurrencyInput(formattedValue));
  };

  const onSubmit = async (data) => {
    try {
      const bodyInventory = {
        name: data.name,
        description: data.description,
        type: data.type,
        measurementUnit: data.measurementUnit,
        ...(data.image && { image: data.image }),
        ...(inventoryType === "returned" && { cost: totalValue }),
      };
      console.log(bodyInventory);
      const response = await createInventory(bodyInventory);
      console.log("Respuesta de la API:", response);
      onFormSubmit();
    } catch (error) {
      console.error("Error al crear el inventario:", error);
    }
  };

  // Opciones para el combo box de unidades de medida
  const measurementUnitOptions = [
    { value: "grams", label: "Kilogramos" },
    { value: "liters", label: "Mililitros" },
    { value: "units", label: "Unidades" },
  ];

  return (
    <CustomHForm
      schema={extendedSchema}
      defaultValues={{
        name: "",
        description: "",
        type: inventoryType || "",
        measurementUnit: "",
        image: null,
        ...(inventoryType === "returned" && { cost: 0 }),
      }}
      onSubmit={onSubmit}
      buttonTitle="Agregar"
      customWidth="500px"
      twoColumns
    >
      {/* Columna 1 */}
      <div>
        <Controller
          name="type"
          render={({ field }) => (
            <input type="hidden" {...field} value={inventoryType} />
          )}
        />
        {/* Campo: Nombre */}
        <Controller
          name="name"
          render={({ field }) => (
            <CustomInput
              {...field}
              id="name"
              label="Nombre"
              placeholder=" "
              value={field.value || ""}
              onChange={field.onChange}
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
              placeholder=" "
              value={field.value || ""}
              onChange={field.onChange}
            />
          )}
        />

        {/* Campo: Unidad de medida (usando CustomSelect) */}
        <Controller
          name="measurementUnit"
          render={({ field }) => (
            <CustomSelect
              id="measurementUnit"
              label="Unidad de medida"
              options={measurementUnitOptions}
              value={
                measurementUnitOptions.find(
                  (option) => option.value === field.value
                ) || null
              }
              onChange={(selectedOption) =>
                field.onChange(selectedOption?.value)
              }
              isSearchable={false}
            />
          )}
        />

        {/* Campo: Costo (solo para tipo "returned") */}
        {inventoryType === "returned" && (
          <Controller
            name="cost"
            render={({ field }) => (
              <CustomInput
                {...field}
                id="cost"
                label="Costo"
                placeholder=" "
                min="0"
                step="0.01"
                value={totalInput}
                onChange={(e) => {
                  handleTotalChange(e);
                  // Actualiza react-hook-form con el valor numérico
                  field.onChange(parseCurrencyInput(e.target.value));
                }}
              />
            )}
          />
        )}

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

InventoriesForm.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
  inventoryType: PropTypes.string,
};
