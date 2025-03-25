import { Controller } from "react-hook-form";
import * as z from "zod";
import { CustomHForm, CustomInput, CustomButton } from "../components";
import PropTypes from "prop-types";

// Esquema de validación con Zod
const inventoriesSchema = z.object({
  code: z.string().min(1, "El código es requerido"),
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().max(10, "La descripción no debe exceder 10 palabras"),
  image: z.instanceof(File).optional(),
  measureId: z.string().min(1, "La unidad de medida es requerida"),
});
export function InventoriesForm({ onFormSubmit }) {
  const onSubmit = (data) => {
    console.log("Datos del formulario:", data);
    onFormSubmit();
  };
  return (
    <CustomHForm
      schema={inventoriesSchema}
      defaultValues={{
        code: "",
        name: "",
        description: "",
        measureId: "",
        image: null,
      }}
      onSubmit={onSubmit}
      buttonTitle="Agregar"
      customWidth="500px"
      twoColumns
    >
      {/* Columna 1 */}
      <div>
        {/* Campo: Código */}
        <Controller
          name="code"
          render={({ field, fieldState: { error } }) => (
            <>
              <CustomInput
                {...field}
                id="code"
                label="Código"
                placeholder=" " // Placeholder siempre es " "
                value={field.value || ""} // Asegurar que value no sea undefined
                onChange={field.onChange} // Pasar onChange directamente
              />
              {error && <span>{error.message}</span>}
            </>
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
          name="measureId"
          render={({ field }) => (
            <CustomInput
              {...field}
              id="measureId"
              label="Unidad"
              placeholder=" " // Placeholder siempre es " "
              value={field.value || ""} // Asegurar que value no sea undefined
              onChange={field.onChange} // Pasar onChange directamente
            />
          )}
        />
        {/* Campo: Imagen */}
        <Controller
          name="image"
          render={({ field }) => (
            <input
              type="file"
              onChange={(e) => field.onChange(e.target.files[0])}
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
};
