import { useState } from "react";
import {
  AiOutlineMail,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import {
  CustomContainer,
  CustomForm,
  CustomButton,
  CustomInput,
} from "../components";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(!showForgotPassword);
  };

  const handleRecoverySubmit = (e) => {
    e.preventDefault();
    console.log("Correo de recuperación enviado a:", recoveryEmail);
    alert(`Se ha enviado un correo de recuperación a: ${recoveryEmail}`);
  };

  return (
    <CustomContainer>
      <h1>Ingreso</h1>
      <CustomForm onSubmit={handleLoginSubmit}>
        <CustomInput
          type="email"
          id="email"
          label="Correo Electrónico"
          placeholder=" "
          icon={<AiOutlineMail size={20} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <CustomInput
          type={passwordVisible ? "text" : "password"}
          id="password"
          label="Contraseña"
          placeholder=" "
          isPassword
          toggleVisibilityIcon={{
            visible: <AiOutlineEyeInvisible size={20} />,
            hidden: <AiOutlineEye size={20} />,
          }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onToggleVisibility={() => setPasswordVisible(!passwordVisible)}
        />

        <CustomButton type="submit">Ingresar</CustomButton>
      </CustomForm>

      <button
        style={{
          background: "none",
          border: "none",
          color: "#007bff",
          cursor: "pointer",
          textAlign: "center",
          marginTop: "10px",
          padding: "0",
          font: "inherit",
        }}
        onClick={handleForgotPasswordClick}
      >
        ¿Olvidaste tu contraseña?
      </button>

      {/* Input y botón para recuperar contraseña (oculto inicialmente) */}
      {showForgotPassword && (
        <CustomForm
          onSubmit={handleRecoverySubmit}
          style={{ marginTop: "10px" }}
        >
          <CustomInput
            type="email"
            id="recovery-email"
            label="Correo Electrónico"
            placeholder=" "
            icon={<AiOutlineMail size={20} />}
            value={recoveryEmail}
            onChange={(e) => setRecoveryEmail(e.target.value)}
          />
          <CustomButton type="submit">Enviar</CustomButton>
        </CustomForm>
      )}
    </CustomContainer>
  );
};
