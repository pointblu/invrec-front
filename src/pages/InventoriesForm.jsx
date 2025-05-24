import { Controller } from "react-hook-form";
import * as z from "zod";
import { CustomHForm, CustomInput, CustomButton } from "../components";
import PropTypes from "prop-types";
import { createInventory } from "../services/api";

// Esquema de validación con Zod
const inventoriesSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z
    .string()
    .max(100, "La descripción no debe exceder 10 caracteres"),
  type: z.string().min(1, "El tipo es requerido"),
  measurementUnit: z.string().min(1, "La unidad de medida es requerida"),
});
export function InventoriesForm({ onFormSubmit, inventoryType }) {
  const onSubmit = async (data) => {
    try {
      const bodyInventory = {
        name: data.name,
        description: data.description,
        type: data.type,
        measurementUnit: data.measurementUnit,
        ...(data.image && { image: data.image }),
      };
      console.log(bodyInventory);
      const response = await createInventory(bodyInventory);
      console.log("Respuesta de la API:", response);
      onFormSubmit();
    } catch (error) {
      console.error("Error al crear el inventario:", error);
    }
  };

  return (
    <CustomHForm
      schema={inventoriesSchema}
      defaultValues={{
        name: "",
        description: "",
        type: inventoryType || "",
        measurementUnit: "",
        image: null,
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
