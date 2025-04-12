import {
  CustomTable,
  CustomContainer,
  CustomButton,
  CustomModal,
} from "../components";
import data from "../purchases_data.json";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useState } from "react";
import { PurchaseForm } from "./PurchaseForm";

export function Purchases() {
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
            onClick={() => setIsModalOpen(true)}
          ></CustomButton>
        }
      />
      <CustomModal
        isOpen={isModalOpen}
        title={"Compras"}
        onClose={handleCloseModal}
      >
        <PurchaseForm onFormSubmit={handleCloseModal} />
      </CustomModal>
    </CustomContainer>
  );
}
