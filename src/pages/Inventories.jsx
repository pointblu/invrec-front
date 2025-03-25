import { GiFlour } from "react-icons/gi";
import { FaBook, FaRecycle } from "react-icons/fa6";
import { HiPlus } from "react-icons/hi";
import {
  CustomTable,
  CustomContainer,
  RenderDescriptionCell,
  CustomButton,
  CustomModal,
} from "../components";
import data from "../inventories_data.json";
import PropTypes from "prop-types";
import { useState } from "react";
import { RecipeForm } from "./RecipeForm";
import { InventoriesForm } from "./InventoriesForm";
import { QuantityForm } from "./QuantityForm";

function ImageCell({ value }) {
  return (
    <>
      {value ? (
        <img
          src={value}
          alt="Producto"
          style={{ width: 25, height: 25, objectFit: "cover" }}
        />
      ) : (
        <span>N/A</span>
      )}
    </>
  );
}
ImageCell.propTypes = {
  value: PropTypes.string,
};

function renderImageCell({ getValue }) {
  const value = getValue();
  return <ImageCell value={value} />;
}

renderImageCell.propTypes = {
  getValue: PropTypes.func.isRequired,
};

function renderActionsCell({ row }, filterType, openAddModal) {
  if (filterType === "returned") {
    return (
      <CustomButton
        icon={<HiPlus />}
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
  return null; // No mostrar nada para "raw"
}
export function Inventories({ title, filterType }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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

  const columns = [
    {
      header: "Imagen",
      accessorKey: "image",
      cell: renderImageCell,
    },
    {
      header: "Código",
      accessorKey: "code",
    },
    {
      header: "Nombre",
      accessorKey: "name",
    },
    {
      header: "Descripción",
      accessorKey: "description",
      cell: RenderDescriptionCell,
    },
    {
      header: "Existencias",
      accessorKey: "stock",
    },
    {
      header: "Unidad",
      accessorKey: "measureId",
    },
    {
      header: "Costo promedio",
      accessorKey: "cost",
    },
    ...(filterType === "returned"
      ? [
          {
            header: "Acciones",
            accessorKey: "actions",
            cell: ({ row }) =>
              renderActionsCell({ row }, filterType, handleOpenAddModal),
          },
        ]
      : []),
  ];

  const iconsMap = {
    raw: <GiFlour />,
    processed: <FaBook />,
    returned: <FaRecycle />,
  };

  const modalTitleMap = {
    raw: "NUEVO INSUMO",
    processed: "NUEVO PRODUCTO",
    returned: "NUEVO REUTILIZABLE",
  };

  const datum = data.filter((item) => item.type === filterType);
  const icon = iconsMap[filterType];
  return (
    <CustomContainer>
      <h1>{title}</h1>
      <CustomTable
        data={datum}
        columns={columns}
        customButtons={
          <CustomButton
            icon={icon}
            onClick={() => setIsModalOpen(true)}
          ></CustomButton>
        }
      />
      <CustomModal
        isOpen={isModalOpen}
        title={modalTitleMap[filterType]}
        onClose={handleCloseModal}
      >
        {filterType === "processed" ? (
          <RecipeForm onFormSubmit={handleCloseModal} />
        ) : (
          <InventoriesForm onFormSubmit={handleCloseModal} />
        )}
      </CustomModal>

      {/* Nuevo modal para agregar cantidad */}
      <CustomModal
        isOpen={isAddModalOpen}
        title={`Agregar a: `}
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

Inventories.propTypes = {
  title: PropTypes.string.isRequired,
  filterType: PropTypes.string.isRequired,
};
