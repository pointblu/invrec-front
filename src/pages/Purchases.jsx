import { CustomTable, CustomContainer, CustomButton } from "../components";
import data from "../purchases_data.json";
import { MdOutlineShoppingCart } from "react-icons/md";
export function Purchases() {
  const columns = [
    {
      header: "Fecha",
      accessorKey: "createdAt",
    },
    {
      header: "Código",
      accessorKey: "rawId",
    },
    {
      header: "Insumo",
      accessorKey: "name",
    },
    {
      header: "Cantidad",
      accessorKey: "quantity",
    },
    {
      header: "Costo",
      accessorKey: "cost",
    },
  ];
  return (
    <CustomContainer>
      <h1>Compras</h1>
      <CustomTable
        data={data}
        columns={columns}
        customButtons={
          <CustomButton
            icon={<MdOutlineShoppingCart />}
            onClick={() => console.log("Agregar compra")}
          ></CustomButton>
        }
      />
    </CustomContainer>
  );
}
