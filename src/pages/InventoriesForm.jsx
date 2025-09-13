import { Controller } from "react-hook-form";
import * as z from "zod";
import {
  CustomHForm,
  CustomInput,
  CustomButton,
  CustomSelect,
} from "../components";
import PropTypes from "prop-types";
import { createInventory, updateInventory } from "../services/api";
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

  const cleanValue = value.replace(/[^\d,]/g, "").replace(/(,.*?),/g, "$1");
  const parts = cleanValue.split(",");
  let integerPart = parts[0].replace(/\D/g, "") || "";
  let decimalPart = parts[1] ? parts[1].replace(/\D/g, "").substring(0, 2) : "";

  if (integerPart.length > 3) {
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  let result = `$ ${integerPart}`;
  if (cleanValue.includes(",")) {
    result += decimalPart ? `,${decimalPart}` : ",";
  }

  return result;
};

const parseCurrencyInput = (formattedValue) => {
  if (!formattedValue || formattedValue === "$ ") return "";

  const numericString = formattedValue
    .replace("$", "")
    .replace(/\./g, "")
    .replace(",", ".");

  return parseFloat(numericString) || "";
};

export function InventoriesForm({
  onFormSubmit,
  inventoryType = "",
  initialData = null,
}) {
  const [totalInput, setTotalInput] = useState(
    initialData?.cost ? `$ ${initialData.cost}` : "$ "
  );
  const [totalValue, setTotalValue] = useState(initialData?.cost || "");

  const extendedSchema =
    inventoryType === "returned"
      ? baseSchema.extend({
          cost: z.number().min(0, "El costo debe ser mayor o igual a 0"),
        })
      : baseSchema;

  const handleTotalChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue === "" || inputValue === "$") {
      setTotalInput("$ ");
      setTotalValue("");
      return;
    }

    if (inputValue.includes(",")) {
      const currentFormatted = formatCurrencyInput(inputValue);
      setTotalInput(currentFormatted);
      if (inputValue.split(",")[1]) {
        setTotalValue(parseCurrencyInput(currentFormatted));
      }
      return;
    }

    let newValue = inputValue.startsWith("$") ? inputValue : `$ ${inputValue}`;
    const formattedValue = formatCurrencyInput(newValue);
    setTotalInput(formattedValue);
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

      if (initialData?.id) {
        // Editar
        await updateInventory(initialData.id, bodyInventory);
      } else {
        // Crear
        await createInventory(bodyInventory);
      }

      onFormSubmit();
    } catch (error) {
      console.error("Error al guardar el inventario:", error);
    }
  };

  const measurementUnitOptions = [
    { value: "grams", label: "Kilogramos" },
    { value: "liters", label: "Mililitros" },
    { value: "units", label: "Unidades" },
  ];

  return (
    <CustomHForm
      schema={extendedSchema}
      defaultValues={{
        name: initialData?.name || "",
        description: initialData?.description || "",
        type: inventoryType || "",
        measurementUnit: initialData?.measurementUnit || "",
        image: initialData?.image || null,
        ...(inventoryType === "returned" && { cost: initialData?.cost || 0 }),
      }}
      onSubmit={onSubmit}
      buttonTitle={initialData ? "Actualizar" : "Agregar"}
      customWidth="500px"
      twoColumns
    >
      <div>
        <Controller
          name="type"
          render={({ field }) => (
            <input type="hidden" {...field} value={inventoryType} />
          )}
        />

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

        {inventoryType === "returned" && (
          <Controller
            name="cost"
            render={({ field }) => (
              <CustomInput
                {...field}
                id="cost"
                label="Costo"
                placeholder=" "
                min={0}
                step={0.01}
                value={totalInput}
                onChange={(e) => {
                  handleTotalChange(e);
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
          {initialData ? "Actualizar" : "Agregar"}
        </CustomButton>
      </div>
    </CustomHForm>
  );
}

InventoriesForm.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
  inventoryType: PropTypes.string,
  initialData: PropTypes.object,
};
