import { useState } from "react";
import {
  CustomTable,
  CustomContainer,
  CustomButton,
  CustomModal,
} from "../components";
import data from "../purchases_data.json";
import { FaHammer, FaPrint } from "react-icons/fa";
import { HiCheck } from "react-icons/hi";
import { QuantityForm } from "./QuantityForm";
import { ProductionForm } from "./ProductionForm";

export function Production() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setSelectedItem(null);
  };

  const handleOpenAddModal = (item) => {
    if (!item) return; // Validación adicional
    setSelectedItem(item);
    setIsAddModalOpen(true);
  };

  const handleAddQuantity = ({ quantity }) => {
    console.log("Agregar cantidad:", quantity, "al item:", selectedItem);
    // Aquí iría la lógica para actualizar la cantidad
    handleCloseAddModal();
  };
  const getRandomStatus = () => {
    return Math.random() > 0.5 ? "En proceso" : "Hecho";
  };

  function renderActionsCell({ row }, openAddModal) {
    return (
      <CustomButton
        icon={<HiCheck />}
        onClick={() => openAddModal(row.original)}
        customStyle={{
          default: {
            backgroundColor: "#4CAF50",
            border: "1px solid white",
            color: "white",
            width: "1.8rem",
            height: "1.8rem",
          },
          hover: {
            backgroundColor: "#4caf82",
            transform: "scale(1.05)",
          },
          active: {
            backgroundColor: "#af4cab",
            transform: "scale(0.95)",
          },
        }}
      />
    );
  }

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
      header: "Costo ($)",
      accessorKey: "cost",
    },
    {
      header: "Estado",
      accessorKey: "status",
      cell: () => getRandomStatus(), // Asigna estado aleatorio
    },
    {
      header: "Acciones",
      accessorKey: "actions",
      cell: ({ row }) => renderActionsCell({ row }, handleOpenAddModal),
    },
  ];
  return (
    <CustomContainer>
      <h1>Producción</h1>
      <CustomTable
        data={data}
        columns={columns}
        filtering={globalFilter}
        onFilteringChange={setGlobalFilter}
        customButtons={
          <>
            <CustomButton
              icon={<FaHammer />}
              onClick={() => setIsModalOpen(true)}
            ></CustomButton>
            <CustomButton
              icon={<FaPrint />}
              onClick={() => console.log("Imprimir orden de producción")}
            ></CustomButton>
          </>
        }
      />
      <CustomModal
        isOpen={isModalOpen}
        title={"Pre-producción"}
        onClose={handleCloseModal}
      >
        <ProductionForm onFormSubmit={handleCloseModal} />
      </CustomModal>
      <CustomModal
        isOpen={isAddModalOpen}
        title={`Confirmar producción de : `}
        onClose={handleCloseAddModal}
      >
        {selectedItem ? (
          <QuantityForm
            onSubmit={handleAddQuantity}
            onClose={handleCloseAddModal}
            item={selectedItem}
          />
        ) : (
          <p>No se ha seleccionado ningún item</p>
        )}
      </CustomModal>
    </CustomContainer>
  );
}
