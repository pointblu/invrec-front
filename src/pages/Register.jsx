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

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("Nombre:", name, "Email:", email, "Password:", password); // Lógica del registro
  };

  return (
    <CustomContainer>
      <h1>Registro</h1>
      <CustomForm onSubmit={handleLoginSubmit}>
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

        <CustomButton type="submit">Registrarse</CustomButton>
      </CustomForm>
    </CustomContainer>
  );
};
