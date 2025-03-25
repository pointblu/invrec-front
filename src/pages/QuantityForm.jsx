import PropTypes from "prop-types";
import { useState } from "react";
import { CustomButton, CustomForm, CustomInput } from "../components";

export function QuantityForm({ onSubmit, item }) {
  const [quantity, setQuantity] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      itemId: item.id,
      itemName: item.name,
      quantity: Number(quantity),
    });
  };

  return (
    <CustomForm onSubmit={handleSubmit} customWidth="360px">
      <div style={{ marginBottom: "1.5rem" }}>
        <p
          style={{
            fontWeight: "bold",
            marginBottom: "1rem",
            color: "inherit",
            textAlign: "center",
          }}
        >
          <span style={{ color: "#4CAF50" }}>{item.name}</span>
        </p>

        <CustomInput
          type="number"
          id="quantity-input"
          label="Cantidad"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min={0}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        <CustomButton
          type="submit"
          customStyle={{
            default: {
              padding: "0.5rem 1.5rem",
              fontWeight: "bold",
            },
          }}
        >
          Confirmar
        </CustomButton>
      </div>
    </CustomForm>
  );
}

QuantityForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};
