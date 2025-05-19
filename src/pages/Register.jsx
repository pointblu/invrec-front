import { useState } from "react";
import {
  AiOutlineMail,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineUser,
} from "react-icons/ai";
import {
  CustomContainer,
  CustomForm,
  CustomButton,
  CustomInput,
} from "../components";
import { useNavigate } from "react-router-dom";
import { createUser } from "../services/api";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userData = {
        name,
        email,
        password,
        role: "user",
        status: true,
        subscription: "cf7dc273-4498-47cf-995f-0b326dcd3475",
      };

      // Llamada directa al endpoint
      await createUser(userData);

      navigate("/ingreso", {
        state: {
          registrationSuccess: true,
          message: "Registro exitoso. Por favor inicia sesión.",
        },
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error en el registro";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomContainer>
      <h1>Registro</h1>
      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
      )}
      <CustomForm onSubmit={handleRegisterSubmit}>
        <CustomInput
          type="text"
          id="name"
          label="Nombre"
          placeholder=" "
          icon={<AiOutlineUser size={20} />}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <CustomButton type="submit" disabled={loading}>
          {loading ? "Creando cuenta..." : "Registrarse"}
        </CustomButton>
      </CustomForm>
    </CustomContainer>
  );
};
