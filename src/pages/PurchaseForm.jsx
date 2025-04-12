import { Controller } from "react-hook-form";
import * as z from "zod";
import {
  CustomHForm,
  CustomInput,
  CustomButton,
  CustomSelect,
} from "../components";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import data from "../purchases_data.json";

// Esquema de validación con Zod
const purchaseSchema = z.object({
  date: z.string(),
  productId: z.string().min(1, "El producto es requerido"),
  rawId: z.string(),
  cost: z.number().min(0, "El costo debe ser positivo"),
  quantity: z.number().min(1, "La cantidad debe ser al menos 1"),
});

const formatCurrencyInput = (value) => {
  if (!value) return "$ ";

  // Limpia el valor (permite solo números y una coma)
  const cleanValue = value.replace(/[^\d,]/g, "").replace(/(,.*?),/g, "$1");

  // Separa parte entera y decimal
  const parts = cleanValue.split(",");
  let integerPart = parts[0].replace(/\D/g, "") || "0";
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
  if (!formattedValue || formattedValue === "$ ") return 0;

  const numericString = formattedValue
    .replace("$", "")
    .replace(/\./g, "")
    .replace(",", ".");

  return parseFloat(numericString) || 0;
};

// Función para parsear el costo de string a número

export function PurchaseForm({ onFormSubmit }) {
  const [currentDate, setCurrentDate] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [totalInput, setTotalInput] = useState("$ ");
  const [totalValue, setTotalValue] = useState(0);

  const handleTotalChange = (e) => {
    const inputValue = e.target.value;

    // Si borró  restablece
    if (inputValue === "" || inputValue === "$") {
      setTotalInput("$ ");
      setTotalValue(0);
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

  // Generar fecha actual al cargar el componente
  useEffect(() => {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(
      today.getMonth() + 1
    ).padStart(2, "0")}/${today.getFullYear()}`;
    setCurrentDate(formattedDate);
  }, []);

  // Obtener los valores actualizados para el formulario
  const getFormValues = () => {
    return {
      date: currentDate,
      productId: selectedProduct?.id.toString() || "",
      rawId: selectedProduct?.rawId || "",
      quantity: quantity,
      cost: totalValue,
    };
  };

  return (
    <CustomHForm
      schema={purchaseSchema}
      defaultValues={{
        date: currentDate,
        productId: "",
        rawId: "",
        quantity: 1,
        cost: 0,
      }}
      onSubmit={() => {
        const formData = getFormValues();
        console.log("Datos del formulario:", formData);
        onFormSubmit(formData);
      }}
      buttonTitle="Agregar"
      customWidth="500px"
    >
      {/* Campo: Fecha (solo lectura) */}
      <Controller
        name="date"
        render={({ field }) => (
          <CustomInput
            {...field}
            id="date"
            label="Fecha"
            value={currentDate}
            readOnly
          />
        )}
      />

      {/* Campo: Producto (combobox) */}
      <Controller
        name="productId"
        render={({ field, fieldState: { error } }) => (
          <div>
            <CustomSelect
              id="product"
              label="Producto"
              value={
                field.value
                  ? {
                      value: field.value,
                      label:
                        data.find((p) => p.id.toString() === field.value)
                          ?.name || "",
                    }
                  : { value: "", label: "Seleccione un insumo" }
              }
              onChange={(selectedOption) => {
                const product = data.find(
                  (p) => p.id.toString() === selectedOption.value
                );
                setSelectedProduct(product);
                field.onChange(selectedOption.value);
              }}
              options={[
                { value: "", label: "Seleccione un insumo" },
                ...data.map((product) => ({
                  value: product.id.toString(),
                  label: product.name,
                })),
              ]}
            />
            {error && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {error.message}
              </span>
            )}
          </div>
        )}
      />

      {/* Campo: Código (solo lectura) */}
      <Controller
        name="rawId"
        render={({ field }) => (
          <CustomInput
            {...field}
            id="rawId"
            label="Código"
            value={selectedProduct?.rawId || ""}
            readOnly
          />
        )}
      />

      {/* Campo: Cantidad */}
      <Controller
        name="quantity"
        render={({ field, fieldState: { error } }) => (
          <div>
            <CustomInput
              {...field}
              id="quantity"
              label="Cantidad"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10) || 1;
                const newQuantity = Math.max(1, value);
                setQuantity(newQuantity);
                field.onChange(newQuantity);
              }}
            />
            {error && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {error.message}
              </span>
            )}
          </div>
        )}
      />

      <Controller
        name="cost"
        render={({ field, fieldState: { error } }) => (
          <div>
            <CustomInput
              {...field}
              id="cost"
              label="Costo"
              value={totalInput}
              onChange={(e) => {
                handleTotalChange(e);
                // Actualiza react-hook-form con el valor numérico
                field.onChange(parseCurrencyInput(e.target.value));
              }}
            />
            {error && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {error.message}
              </span>
            )}
          </div>
        )}
      />

      <CustomButton type="submit" style={{ width: "100%", marginTop: "20px" }}>
        Agregar
      </CustomButton>
    </CustomHForm>
  );
}

PurchaseForm.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
};
