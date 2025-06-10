import { useState } from "react";
import { Controller } from "react-hook-form";
import PropTypes from "prop-types";
import { FaPlus, FaTrash } from "react-icons/fa";
import { CustomInput, CustomButton, CustomSelect } from "../components";
import { v4 as uuidv4 } from "uuid";

export function CustomMultiSelect({ control, name, options, setValue }) {
  const [rows, setRows] = useState([
    { id: "uuidv4()", product: null, quantity: 0, cost: 0 },
  ]);

  // Obtener los productos ya seleccionados (excluyendo el actual)
  const getSelectedProducts = (currentId) => {
    return rows
      .filter((row) => row.id !== currentId && row.product)
      .map((row) => row.product.value);
  };

  // Filtrar opciones para excluir las ya seleccionadas
  const getAvailableOptions = (currentId) => {
    const selectedProducts = getSelectedProducts(currentId);
    return options.filter((option) => !selectedProducts.includes(option.value));
  };

  const addRow = () => {
    // Verificar que haya opciones disponibles antes de agregar
    const availableOptions = getAvailableOptions();
    if (availableOptions.length > 0) {
      setRows([...rows, { id: uuidv4(), product: null, quantity: 0, cost: 0 }]);
    }
  };

  const removeRow = (id) => {
    if (rows.length > 1) {
      const updatedRows = rows.filter((row) => row.id !== id);
      setRows(updatedRows);
      setValue(name, updatedRows);
    }
  };

  const handleProductChange = (id, selectedOption) => {
    const updatedRows = rows.map((row) =>
      row.id === id
        ? {
            ...row,
            product: selectedOption,
            cost: selectedOption ? selectedOption.cost : 0,
          }
        : row
    );
    setRows(updatedRows);
    setValue(name, updatedRows);
  };

  const handleQuantityChange = (id, value) => {
    const updatedRows = rows.map((row) =>
      row.id === id ? { ...row, quantity: value } : row
    );
    setRows(updatedRows);

    // Actualizar el valor del formulario con el valor numérico
    setValue(
      name,
      updatedRows.map((row) => ({
        ...row,
        quantity: parseFloat(row.quantity) || 0,
      }))
    );
  };

  const handleQuantityBlur = (id) => {
    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        const numericValue = parseFloat(row.quantity) || 1;
        const formattedValue = numericValue.toFixed(2);
        return { ...row, quantity: formattedValue };
      }
      return row;
    });
    setRows(updatedRows);
    setValue(
      name,
      updatedRows.map((row) => ({
        ...row,
        quantity: parseFloat(row.quantity) || 0,
      }))
    );
  };

  return (
    <Controller
      name={name}
      control={control}
      render={() => (
        <>
          {rows.map((row) => {
            const availableOptions = getAvailableOptions(row.id);
            const isLastRow = row.id === rows[rows.length - 1].id;

            return (
              <div
                key={row.id}
                style={{
                  display: "flex",
                  gap: "5px",
                  marginBottom: "5px",
                  alignItems: "center",
                }}
              >
                {/* Select para elegir el producto */}
                <div style={{ flex: 1.4 }}>
                  <CustomSelect
                    id={`product-${row.id}`}
                    label="Ingrediente"
                    options={availableOptions}
                    value={row.product}
                    onChange={(selectedOption) =>
                      handleProductChange(row.id, selectedOption)
                    }
                    placeholder=" "
                    maxWidth="100%"
                    isDisabled={availableOptions.length === 0}
                  />
                </div>

                {/* CustomInput para la cantidad */}
                <div style={{ flex: 0.3 }}>
                  <CustomInput
                    id={`quantity-${row.id}`}
                    label="Cantidad"
                    type="text" // Cambiado a text para mejor control
                    value={row.quantity}
                    onChange={(e) => {
                      // Permitir números, punto decimal y borrado
                      const value = e.target.value.replace(/[^0-9.]/g, "");
                      // Permitir solo un punto decimal
                      const parts = value.split(".");
                      if (parts.length <= 2) {
                        handleQuantityChange(row.id, value);
                      }
                    }}
                    onBlur={() => handleQuantityBlur(row.id)}
                    maxWidth="100px"
                    disabled={!row.product}
                  />
                </div>

                {/* CustomInput para el costo (solo lectura) */}
                <div style={{ flex: 0.4 }}>
                  <CustomInput
                    id={`cost-${row.id}`}
                    label="Costo"
                    type="text"
                    value={`$${row.cost.toFixed(2)}`}
                    readOnly
                    maxWidth="150px"
                  />
                </div>

                {/* Botón para eliminar la fila (excepto la primera) */}
                {rows.length > 1 && (
                  <div style={{ flex: 0.1 }}>
                    <CustomButton
                      type="button"
                      onClick={() => removeRow(row.id)}
                      icon={<FaTrash size={12} />}
                      customStyle={{
                        default: {
                          padding: "5px",
                          borderRadius: "50%",
                          backgroundColor: "#ff4d4d",
                        },
                        hover: {
                          backgroundColor: "#cc0000",
                        },
                      }}
                    />
                  </div>
                )}

                {/* Botón "plus" para agregar una nueva fila (solo en la última fila) */}
                {isLastRow && (
                  <div style={{ flex: 0.1 }}>
                    <CustomButton
                      type="button"
                      onClick={addRow}
                      icon={<FaPlus size={12} />}
                      customStyle={{
                        default: {
                          padding: "5px",
                          borderRadius: "50%",
                          backgroundColor:
                            availableOptions.length > 0 ? "#007bff" : "#cccccc",
                        },
                        hover: {
                          backgroundColor:
                            availableOptions.length > 0 ? "#0056b3" : "#cccccc",
                        },
                      }}
                      disabled={availableOptions.length === 0}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
    />
  );
}

CustomMultiSelect.propTypes = {
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
      cost: PropTypes.number.isRequired,
    })
  ).isRequired,
  setValue: PropTypes.func.isRequired,
};
