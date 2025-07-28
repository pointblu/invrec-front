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
import { createSale, getAllInventories } from "../services/api";
import { toast } from "react-toastify";
// Esquema de validación Zod
const saleSchema = z.object({
  inventoryId: z.string().min(1, "El producto es requerido"),
  quantity: z.number().min(0.01, "La cantidad debe ser al menos 0.01"),
  date: z.string(),
});

export function SalesForm({ onFormSubmit }) {
  const [currentDate, setCurrentDate] = useState("");
  const [inventories, setInventories] = useState([]);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Obtener fecha actual en formato YYYY-MM-DD
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    setCurrentDate(formattedDate);
  }, []);

  useEffect(() => {
    const loadInventories = async () => {
      try {
        const response = await getAllInventories(1, 3000);
        const processedInventories =
          response?.data?.result?.filter((inv) => inv.type === "processed") ||
          [];
        setInventories(processedInventories);
      } catch (error) {
        console.error("Error al cargar inventarios:", error);
      }
    };

    loadInventories();
  }, []);

  const getFormValues = () => ({
    inventoryId: selectedInventory?.id || "",
    quantity: parseFloat(quantity),
    date: currentDate,
  });

  const handleSubmit = async () => {
    const formData = getFormValues();
    try {
      await createSale(formData);
      toast.success("Venta registrada correctamente ✅");
      onFormSubmit(formData);
    } catch (error) {
      console.error("Error al crear la venta:", error);
      console.log("acaaaaaa", error);
      // Mostrar notificación si es error 422
      if (<error className="message"></error> === "Inventory insufficient") {
        toast.error(`Error:Existencias insuficientes`);
      } else {
        toast.error("Ocurrió un error al crear la venta.");
      }
    }
  };

  return (
    <CustomHForm
      schema={saleSchema}
      defaultValues={{
        inventoryId: "",
        quantity: 1,
        date: currentDate,
      }}
      onSubmit={handleSubmit}
      buttonTitle="Agregar"
      customWidth="500px"
    >
      {/* Fecha (solo lectura) */}
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

      {/* Selector de Producto */}
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
                  : { value: "", label: "Seleccione un producto" }
              }
              onChange={(selectedOption) => {
                const inventory = inventories.find(
                  (inv) => inv.id === selectedOption.value
                );
                setSelectedInventory(inventory);
                field.onChange(selectedOption.value);
              }}
              options={[
                { value: "", label: "Seleccione un producto" },
                ...inventories.map((inv) => ({
                  value: inv.id,
                  label: inv.name,
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

      {/* Cantidad */}
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
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val >= 0.01) {
                  setQuantity(val);
                  field.onChange(val);
                }
              }}
              onBlur={(e) => {
                if (!e.target.value || isNaN(parseFloat(e.target.value))) {
                  setQuantity(1);
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

      <CustomButton type="submit" style={{ width: "100%", marginTop: "20px" }}>
        Agregar
      </CustomButton>
    </CustomHForm>
  );
}

SalesForm.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
};
