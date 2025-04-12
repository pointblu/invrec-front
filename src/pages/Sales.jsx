import {
  CustomTable,
  CustomContainer,
  CustomButton,
  CustomModal,
} from "../components";
import data from "../sales_data.json";
import { TbCashRegister } from "react-icons/tb";
import { SalesForm } from "./SalesForm";
import { useState } from "react";

export function Sales() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
      header: "Producto",
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
            onClick={() => setIsModalOpen(true)}
          ></CustomButton>
        }
      />
      <CustomModal
        isOpen={isModalOpen}
        title={"Venta"}
        onClose={handleCloseModal}
      >
        <SalesForm onFormSubmit={handleCloseModal} />
      </CustomModal>
    </CustomContainer>
  );
}
