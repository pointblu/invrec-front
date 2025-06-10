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
  quantity: z.number().min(0.01, "La cantidad debe ser al menos 0.01"),
  price: z.number().min(0.01, "El precio debe ser positivo"),
  brand: z.string().min(1, "La marca es requerida"),
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
        const response = await getAllInventories();
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

    // Si borró restablece
    if (inputValue === "" || inputValue === "$") {
      setPriceInput("$ ");
      setPriceValue(0);
      return;
    }

    // Manejo especial cuando el usuario está escribiendo decimales
    if (inputValue.includes(",")) {
      const currentFormatted = formatCurrencyInput(inputValue);
      setPriceInput(currentFormatted);

      // Solo actualiza el valor numérico si hay dígitos después de la coma
      if (inputValue.split(",")[1]) {
        setPriceValue(parseCurrencyInput(currentFormatted));
      }
      return;
    }

    // Mantiene el símbolo $ al principio
    let newValue = inputValue.startsWith("$") ? inputValue : `$ ${inputValue}`;

    // Formatea el valor
    const formattedValue = formatCurrencyInput(newValue);
    setPriceInput(formattedValue);

    // Actualiza el valor numérico
    setPriceValue(parseCurrencyInput(formattedValue));
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
              type="number"
              step="any"
              min="any"
              value={quantity}
              onChange={(e) => {
                // Permitir entrada vacía temporalmente
                if (e.target.value === "") {
                  setQuantity("");
                  field.onChange("");
                  return;
                }

                // Convertir a número
                const value = parseFloat(e.target.value);

                // Validar que sea un número válido y positivo
                if (!isNaN(value) && value >= 0.01) {
                  const newQuantity = value;
                  setQuantity(newQuantity);
                  field.onChange(newQuantity);
                }
              }}
              onBlur={(e) => {
                // Asegurar un valor válido al salir del campo
                if (
                  e.target.value === "" ||
                  isNaN(parseFloat(e.target.value))
                ) {
                  const defaultQuantity = 1;
                  setQuantity(defaultQuantity);
                  field.onChange(defaultQuantity);
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
