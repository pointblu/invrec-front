import PropTypes from "prop-types";
import { useState } from "react";
import { CustomForm, CustomInput, CustomButton } from "../components";

export function ProfitForm({ onSubmit, item }) {
  const [profitPercentage, setProfitPercentage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      inventoryId: item.id,
      itemName: item.name,
      profitPercentage: Number(profitPercentage),
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
          Asignar ganancia a:{" "}
          <span style={{ color: "#4CAF50" }}>{item.name}</span>
        </p>

        <CustomInput
          type="number"
          id="profit-input"
          label="Porcentaje de ganancia"
          value={profitPercentage}
          onChange={(e) => setProfitPercentage(e.target.value)}
          min={0}
          max={100}
          placeholder="Ej: 25"
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

ProfitForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};
