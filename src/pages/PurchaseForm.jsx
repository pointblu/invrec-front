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
import { createPurchase, getAllInventories } from "../services/api";

// Esquema de validación con Zod
const purchaseSchema = z.object({
  date: z.string(),
  inventoryId: z.string().min(1, "El producto es requerido"),
  quantity: z.number().min(0.001, "La cantidad debe ser mayor a 0"), // Cambiado a 0.001
  price: z.number().min(0.01, "El precio debe ser positivo"),
  brand: z.string().min(1, "La marca es requerida"),
});

const formatCurrencyInput = (value) => {
  if (!value || value === "$ ") return "$ ";

  // Limpia el valor (permite solo números y una coma)
  const cleanValue = value.replace(/[^\d,]/g, "").replace(/(,.*?),/g, "$1");

  // Si después de limpiar está vacío, retorna solo el símbolo $
  if (cleanValue === "") return "$ ";

  // Separa parte entera y decimal
  const parts = cleanValue.split(",");
  let integerPart = parts[0].replace(/\D/g, "") || ""; // Cambiado a string vacío
  let decimalPart = parts[1] ? parts[1].replace(/\D/g, "").substring(0, 2) : "";

  // Si no hay parte entera, retorna solo el símbolo $
  if (integerPart === "") return "$ ";

  // Agrega separadores de miles solo si hay dígitos
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
    .replace(",", ".")
    .trim();

  const result = parseFloat(numericString);
  return isNaN(result) ? 0 : result;
};

export function PurchaseForm({ onFormSubmit }) {
  const [currentDate, setCurrentDate] = useState("");
  const [inventories, setInventories] = useState([]);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [priceInput, setPriceInput] = useState("$ ");
  const [priceValue, setPriceValue] = useState(0);
  const [brand, setBrand] = useState("");

  // Cargar inventarios al montar el componente
  useEffect(() => {
    const loadInventories = async () => {
      try {
        const response = await getAllInventories(1, 3000);
        // Filtrar solo inventarios de tipo raw (materia prima)
        const rawInventories = response?.data?.result.filter(
          (inv) => inv.type === "raw"
        );
        setInventories(rawInventories);
      } catch (error) {
        console.error("Error al cargar inventarios:", error);
      }
    };

    loadInventories();
  }, []);

  // Generar fecha actual al cargar el componente
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // Formato YYYY-MM-DD
    setCurrentDate(formattedDate);
  }, []);

  const handlePriceChange = (e) => {
    const inputValue = e.target.value;

    // Si borró todo, restablece
    if (inputValue === "" || inputValue === "$") {
      setPriceInput("$ ");
      setPriceValue(0);
      return;
    }

    // Si solo escribió "$ " o está vacío
    if (inputValue === "$ " || inputValue.trim() === "$") {
      setPriceInput("$ ");
      setPriceValue(0);
      return;
    }

    // Manejo especial cuando el usuario está escribiendo decimales
    if (inputValue.includes(",")) {
      const currentFormatted = formatCurrencyInput(inputValue);
      setPriceInput(currentFormatted);

      // Actualizar el valor numérico
      const numericValue = parseCurrencyInput(currentFormatted);
      setPriceValue(numericValue);
      return;
    }

    // Mantiene el símbolo $ al principio si no lo tiene
    let newValue = inputValue.startsWith("$") ? inputValue : `$ ${inputValue}`;

    // Formatea el valor
    const formattedValue = formatCurrencyInput(newValue);
    setPriceInput(formattedValue);

    // Actualiza el valor numérico
    const numericValue = parseCurrencyInput(formattedValue);
    setPriceValue(numericValue);
  };

  // Obtener los valores actualizados para el formulario
  const getFormValues = () => {
    return {
      inventoryId: selectedInventory?.id || "",
      quantity: parseFloat(quantity),
      price: priceValue,
      brand: brand,
      purchaseDate: currentDate,
    };
  };

  const handleSubmit = async () => {
    const formData = getFormValues();
    try {
      await createPurchase(formData);
      onFormSubmit(formData);
    } catch (error) {
      console.error("Error al crear la compra:", error);
      // Puedes manejar el error aquí (mostrar mensaje al usuario, etc.)
    }
  };

  return (
    <CustomHForm
      schema={purchaseSchema}
      defaultValues={{
        date: currentDate,
        inventoryId: "",
        quantity: 1,
        price: 0,
        brand: "",
      }}
      onSubmit={handleSubmit}
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
            type="date"
            value={currentDate}
            readOnly
          />
        )}
      />

      {/* Campo: Producto (combobox) */}
      <Controller
        name="inventoryId"
        render={({ field, fieldState: { error } }) => (
          <div>
            <CustomSelect
              id="inventory"
              label="Producto"
              value={
                field.value
                  ? {
                      value: field.value,
                      label:
                        inventories.find((inv) => inv.id === field.value)
                          ?.name || "",
                    }
                  : { value: "", label: "Seleccione un insumo" }
              }
              onChange={(selectedOption) => {
                const inventory = inventories.find(
                  (inv) => inv.id === selectedOption.value
                );
                setSelectedInventory(inventory);
                field.onChange(selectedOption.value);
              }}
              options={[
                { value: "", label: "Seleccione un insumo" },
                ...inventories.map((inventory) => ({
                  value: inventory.id,
                  label: inventory.name,
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

      {/* Campo: Cantidad (con decimales) */}
      <Controller
        name="quantity"
        render={({ field, fieldState: { error } }) => (
          <div>
            <CustomInput
              {...field}
              id="quantity"
              label="Cantidad"
              type="text" // Cambiar a text para mayor control
              value={quantity}
              onChange={(e) => {
                const inputValue = e.target.value;

                // Permitir entrada vacía
                if (inputValue === "") {
                  setQuantity("");
                  field.onChange("");
                  return;
                }

                // Validar que solo contenga números, coma o punto
                const validFormat = /^[0-9]*[,.]?[0-9]*$/.test(inputValue);
                if (!validFormat) return;

                // Reemplazar coma por punto para el valor numérico
                const numericValue = inputValue.replace(",", ".");

                // Convertir a número
                const value = parseFloat(numericValue);

                // Validar que sea un número válido y positivo
                if (!isNaN(value) && value > 0) {
                  setQuantity(inputValue); // Mantener el formato original (con coma o punto)
                  field.onChange(value); // Enviar el valor numérico a react-hook-form
                } else if (inputValue === "0," || inputValue === "0.") {
                  // Permitir que el usuario empiece a escribir "0," o "0."
                  setQuantity(inputValue);
                  field.onChange(0);
                }
              }}
              onBlur={(e) => {
                const inputValue = e.target.value;

                // Si está vacío o no es válido, establecer valor por defecto
                if (
                  inputValue === "" ||
                  !/^[0-9]+[,.]?[0-9]*$/.test(inputValue)
                ) {
                  const defaultQuantity = "1";
                  setQuantity(defaultQuantity);
                  field.onChange(1);
                  return;
                }

                // Formatear el valor al salir del campo
                const numericValue = parseFloat(inputValue.replace(",", "."));

                if (!isNaN(numericValue) && numericValue > 0) {
                  // Formatear con coma decimal al salir
                  const formattedValue = numericValue
                    .toString()
                    .replace(".", ",");
                  setQuantity(formattedValue);
                  field.onChange(numericValue);
                } else {
                  const defaultQuantity = "1";
                  setQuantity(defaultQuantity);
                  field.onChange(1);
                }
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

      {/* Campo: Precio */}
      <Controller
        name="price"
        render={({ field, fieldState: { error } }) => (
          <div>
            <CustomInput
              {...field}
              id="price"
              label="Precio"
              value={priceInput}
              onChange={(e) => {
                handlePriceChange(e);
                field.onChange(priceValue);
              }}
              onFocus={() => {
                // Eliminamos el parámetro 'e' que no se usa
                if (priceInput === "$ " || priceInput === "$0") {
                  setPriceInput("$ ");
                }
              }}
              placeholder="$ 0,00"
            />
            {error && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {error.message}
              </span>
            )}
          </div>
        )}
      />

      {/* Campo: Marca */}
      <Controller
        name="brand"
        render={({ field, fieldState: { error } }) => (
          <div>
            <CustomInput
              {...field}
              id="brand"
              label="Marca"
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
                field.onChange(e.target.value);
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
