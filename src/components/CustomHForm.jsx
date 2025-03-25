import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PropTypes from "prop-types";
import { CustomForm } from "../components";

export const CustomHForm = ({
  schema,
  defaultValues,
  onSubmit,
  children,
  twoColumns,
  customWidth,
  firstColumnWidth,
}) => {
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });
  console.log("Errores del formulario:", methods.formState.errors);
  console.log("Schema del formulario:", schema);
  return (
    <FormProvider {...methods}>
      <CustomForm
        onSubmit={methods.handleSubmit(onSubmit)}
        customWidth={customWidth || "360px"}
        twoColumns={twoColumns}
        firstColumnWidth={firstColumnWidth || "360px"}
      >
        {children}
      </CustomForm>
    </FormProvider>
  );
};

CustomHForm.propTypes = {
  schema: PropTypes.object.isRequired,
  defaultValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node,
  buttonTitle: PropTypes.string.isRequired,
  twoColumns: PropTypes.bool,
  customWidth: PropTypes.string,
  firstColumnWidth: PropTypes.string,
};
