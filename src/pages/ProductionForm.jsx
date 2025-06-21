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
import { createProduction, getAllInventories } from "../services/api";

// Esquema de validación con Zod
const productionSchema = z.object({
  productId: z.string().min(1, "El producto es requerido"),
  toMade: z.number().min(0.01, "La cantidad debe ser al menos 0.01"),
});

export function ProductionForm({ onFormSubmit }) {
  const [currentDate, setCurrentDate] = useState("");
  const [inventories, setInventories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toMade, setToMade] = useState(1);

  // Cargar inventarios al montar el componente
  useEffect(() => {
    const loadInventories = async () => {
      try {
        const response = await getAllInventories(1, 3000);
        // Filtrar solo inventarios de tipo processed (productos terminados)
        const processedInventories = response?.data?.result.filter(
          (inv) => inv.type === "processed"
        );
        setInventories(processedInventories);
      } catch (error) {
        console.error("Error al cargar inventarios:", error);
      }
    };

    loadInventories();
  }, []);

  // Generar fecha actual al cargar el componente
  useEffect(() => {
    const getLocalISODate = () => {
      const now = new Date();
      // Ajustamos para obtener la fecha local correcta
      const offset = now.getTimezoneOffset();
      const localDate = new Date(now.getTime() - offset * 60 * 1000);
      return localDate.toISOString().split("T")[0];
    };

    setCurrentDate(getLocalISODate());
  }, []);

  // Calcular costo total
  const calculateTotalCost = () => {
    if (selectedProduct && toMade) {
      return parseFloat(selectedProduct.cost) * toMade;
    }
    return 0;
  };

  // Obtener los valores actualizados para el formulario
  const getFormValues = () => {
    return {
      inventoryId: selectedProduct?.id || "",
      toMade: parseFloat(toMade),
      made: 0, // Valor por defecto
      cost: calculateTotalCost(),
      status: "en_proceso", // Valor por defecto
      productionDate: currentDate, // Fecha actual
    };
  };

  const handleSubmit = async () => {
    const formData = getFormValues();
    try {
      await createProduction(formData);
      onFormSubmit(formData);
    } catch (error) {
      console.error("Error al crear la producción:", error);
      // Puedes manejar el error aquí (mostrar mensaje al usuario, etc.)
    }
  };

  return (
    <CustomHForm
      schema={productionSchema}
      defaultValues={{
        productId: "",
        toMade: 1,
      }}
      onSubmit={handleSubmit}
      buttonTitle="Agregar"
      customWidth="500px"
    >
      {/* Campo: Fecha (solo lectura) */}
      <CustomInput
        id="productionDate"
        label="Fecha de Producción"
        type="date"
        value={currentDate}
        readOnly
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
                        inventories.find((inv) => inv.id === field.value)
                          ?.name || "",
                    }
                  : { value: "", label: "Seleccione un producto" }
              }
              onChange={(selectedOption) => {
                const product = inventories.find(
                  (inv) => inv.id === selectedOption.value
                );
                setSelectedProduct(product);
                field.onChange(selectedOption.value);
              }}
              options={[
                { value: "", label: "Seleccione un producto" },
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

      {/* Campo: Cantidad a Producir (toMade) */}
      <Controller
        name="toMade"
        render={({ field, fieldState: { error } }) => (
          <div>
            <CustomInput
              {...field}
              id="toMade"
              label="Cantidad a Producir"
              type="number"
              step="any"
              min="any"
              value={toMade}
              onChange={(e) => {
                // Permitir entrada vacía temporalmente
                if (e.target.value === "") {
                  setToMade("");
                  field.onChange("");
                  return;
                }

                // Convertir a número
                const value = parseFloat(e.target.value);

                // Validar que sea un número válido y positivo
                if (!isNaN(value) && value >= 0.01) {
                  setToMade(value);
                  field.onChange(value);
                }
              }}
              onBlur={(e) => {
                // Asegurar un valor válido al salir del campo
                if (
                  e.target.value === "" ||
                  isNaN(parseFloat(e.target.value))
                ) {
                  const defaultQuantity = 1;
                  setToMade(defaultQuantity);
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

      {/* Campo: Costo Unitario (solo lectura) */}
      <CustomInput
        id="unitCost"
        label="Costo Unitario"
        value={
          selectedProduct
            ? `$ ${parseFloat(selectedProduct.cost).toFixed(2)}`
            : "$ 0.00"
        }
        readOnly
      />

      {/* Campo: Costo Total (solo lectura) */}
      <CustomInput
        id="totalCost"
        label="Costo Total Estimado"
        value={`$ ${calculateTotalCost().toFixed(2)}`}
        readOnly
      />

      {/* Campo: Estado (solo lectura) */}
      <CustomInput id="status" label="Estado" value="En proceso" readOnly />

      <CustomButton type="submit" style={{ width: "100%", marginTop: "20px" }}>
        Agregar
      </CustomButton>
    </CustomHForm>
  );
}

ProductionForm.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
};
