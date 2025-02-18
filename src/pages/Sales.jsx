import { CustomTable, CustomContainer, CustomButton } from "../components";
import data from "../sales_data.json";
import { TbCashRegister } from "react-icons/tb";
export function Sales() {
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
      header: "Precio unitario",
      accessorKey: "unitPrice",
    },
    {
      header: "Total",
      accessorKey: "total",
    },
  ];
  return (
    <CustomContainer>
      <h1>Ventas</h1>
      <CustomTable
        data={data}
        columns={columns}
        customButtons={
          <CustomButton
            icon={<TbCashRegister />}
            onClick={() => console.log("Agregar venta")}
          ></CustomButton>
        }
      />
    </CustomContainer>
  );
}
