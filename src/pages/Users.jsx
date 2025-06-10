import { CustomTable, CustomContainer, CustomButton } from "./../components";
import { HiOutlineUserAdd } from "react-icons/hi";
import { useEffect, useState } from "react";
import { getAllUser } from "../services/api";

export function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUser(1, 10); // Página 1, 10 items por página
        setUsers(usersData?.data?.result);
      } catch (err) {
        setError(err.message || "Error al cargar los usuarios");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const columns = [
    {
      header: "#",
      cell: ({ row }) => row.index + 1,
    },
    {
      header: "Nombre",
      accessorKey: "name",
    },
    {
      header: "Rol",
      accessorKey: "role",
      cell: (info) => {
        const role = info.getValue();
        return role === "administrator" ? "Administrador" : "Usuario";
      },
    },
    {
      header: "Correo electrónico",
      accessorKey: "email",
    },
    {
      header: "Fecha de registro",
      accessorKey: "subscriptionStart",
      cell: (info) => {
        const date = new Date(info.getValue());
        return date.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
    },
    {
      header: "Tipo de suscripción",
      accessorKey: "subscription.name",
      cell: (info) => {
        const subscription = info.row.original.subscription;
        return subscription.name === "eternal"
          ? "Sin vencimiento"
          : subscription.name;
      },
    },
  ];

  if (loading) return <div>Cargando usuarios...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <CustomContainer>
      <h1>Usuarios</h1>
      <CustomTable
        data={users}
        columns={columns}
        filtering={globalFilter}
        onFilteringChange={setGlobalFilter}
        customButtons={
          <CustomButton
            icon={<HiOutlineUserAdd />}
            onClick={() => console.log("Agregar usuario")}
          ></CustomButton>
        }
        onRowClick={(user) => console.log("Fila clickeada:", user)}
      />
    </CustomContainer>
  );
}
