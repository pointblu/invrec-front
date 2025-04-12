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
import data from "../sales_data.json";

// Esquema de validación con Zod
const productionSchema = z.object({
  date: z.string(),
  productId: z.string().min(1, "El producto es requerido"),
  rawId: z.string(),
  unitPrice: z.number().min(0, "El precio unitario debe ser positivo"),
  total: z.number().min(0, "El total debe ser positivo"),
  quantity: z.number().min(1, "La cantidad debe ser al menos 1"),
});

const formatCurrencyDisplay = (value) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(value)
    .replace("ARS", "")
    .trim();
};

export function SalesForm({ onFormSubmit }) {
  const [currentDate, setCurrentDate] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Generar fecha actual al cargar el componente
  useEffect(() => {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(
      today.getMonth() + 1
    ).padStart(2, "0")}/${today.getFullYear()}`;
    setCurrentDate(formattedDate);
  }, []);

  // Función para parsear el costo
  const parseCost = (costString) => {
    return costString ? parseFloat(costString.replace(/[^0-9.-]+/g, "")) : 0;
  };

  // Calcular costo total
  const calculatetotal = () => {
    if (selectedProduct && quantity) {
      const unitPrice = parseCost(selectedProduct.unitPrice);
      return unitPrice * quantity;
    }
    return 0;
  };

  // Obtener los valores actualizados para el formulario
  const getFormValues = () => {
    return {
      date: currentDate,
      productId: selectedProduct?.id.toString() || "",
      rawId: selectedProduct?.rawId || "",
      unitPrice: selectedProduct ? parseCost(selectedProduct.unitPrice) : 0,
      total: calculatetotal(),
      quantity: quantity,
    };
  };

  return (
    <CustomHForm
      schema={productionSchema}
      defaultValues={{
        date: currentDate,
        productId: "",
        rawId: "",
        unitPrice: 0,
        total: 0,

        quantity: 1,
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
                  : { value: "", label: "Seleccione un producto" }
              }
              onChange={(selectedOption) => {
                const product = data.find(
                  (p) => p.id.toString() === selectedOption.value
                );
                setSelectedProduct(product);
                field.onChange(selectedOption.value);
              }}
              options={[
                { value: "", label: "Seleccione un producto" },
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

      {/* Campo: Costo Unitario (solo lectura) */}
      <Controller
        name="unitPrice"
        render={({ field }) => (
          <CustomInput
            {...field}
            id="unitPrice"
            label="Precio Unitario"
            value={formatCurrencyDisplay(
              parseCost(selectedProduct?.unitPrice || 0)
            )}
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

      {/* Campo: Costo Total (solo lectura) */}
      <Controller
        name="total"
        render={({ field }) => (
          <CustomInput
            {...field}
            id="total"
            label="Total"
            value={formatCurrencyDisplay(calculatetotal())}
            readOnly
          />
        )}
      />

      <CustomButton type="submit" style={{ width: "100%", marginTop: "20px" }}>
        Agregar
      </CustomButton>
    </CustomHForm>
  );
}

SalesForm.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
};
