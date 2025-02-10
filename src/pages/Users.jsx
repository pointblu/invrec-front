import { CustomTable, CustomContainer, CustomButton } from "./../components";
import data from "../users_data.json";
import { HiOutlineUserAdd } from "react-icons/hi";
export function Users() {
  const columns = [
    {
      header: "Id",
      accessorKey: "id",
    },
    {
      header: "Nombre",
      accessorKey: "name",
    },
    {
      header: "Rol",
      accessorKey: "role",
    },
    {
      header: "Correo electrónico",
      accessorKey: "email",
    },
    {
      header: "Fecha de registro",
      accessorKey: "createdAt",
    },
    {
      header: "Tipo de suscripción",
      accessorKey: "suscriptionId",
    },
  ];
  return (
    <CustomContainer>
      <h1>Usuarios</h1>
      <CustomTable
        data={data}
        columns={columns}
        customButtons={
          <CustomButton
            icon={<HiOutlineUserAdd />}
            onClick={() => console.log("Agregar usuario")}
          ></CustomButton>
        }
      />
    </CustomContainer>
  );
}
