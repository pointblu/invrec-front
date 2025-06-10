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
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { InventoriesForm } from "./InventoriesForm";
import { QuantityForm } from "./QuantityForm";
import { getAllInventories } from "../services/api";
import { RecipeFormWrapper } from "./RecipeFormWrapper";

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
        <img
          src={
            "https://res.cloudinary.com/diitm4dx7/image/upload/v1748043928/oe1pvye0dxn4wfczdyor.png"
          }
          alt="Producto"
          style={{ width: 25, height: 25, objectFit: "cover" }}
        />
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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    totalItems: 0,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAllInventories(1, 3000); // Traemos todos desde backend
      const allItems = response?.data?.result || [];

      const filtered = allItems.filter((item) => item.type === filterType);
      const pageSize = 10;
      const startIndex = (pagination.page - 1) * pageSize;
      const endIndex = startIndex + pageSize;

      setData(filtered.slice(startIndex, endIndex)); // solo 10 visibles
      setPagination((prev) => ({
        ...prev,
        totalItems: filtered.length,
      }));
      setError(null);
    } catch (err) {
      setError(err.message || "Error al cargar inventarios");
      console.error("Error fetching inventories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page, filterType]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchData();
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setSelectedItem(null);
  };

  const handleOpenAddModal = (item) => {
    if (!item) return;
    setSelectedItem(item);
    setIsAddModalOpen(true);
  };

  const handleAddQuantity = ({ quantity }) => {
    console.log("Agregar cantidad:", quantity, "al item:", selectedItem);
    handleCloseAddModal();
    fetchData();
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
      accessorKey: "measurementUnit",
      cell: ({ getValue }) => {
        const value = getValue();
        switch (value) {
          case "grams":
            return "Kilogramos";
          case "liters":
            return "Mililitros";
          case "units":
            return "Unidades";
          default:
            return value;
        }
      },
    },
    {
      header: "Costo promedio ($)",
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

  const datum = data;
  const icon = iconsMap[filterType];

  if (loading) return <div>Cargando inventarios...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <CustomContainer>
      <h1>{title}</h1>
      <CustomTable
        data={datum}
        columns={columns}
        pagination={{
          page: pagination.page,
          totalItems: pagination.totalItems,
          pageSize: 10,
        }}
        onPageChange={handlePageChange}
        filtering={globalFilter}
        onFilteringChange={setGlobalFilter}
        customButtons={
          <CustomButton
            icon={icon}
            onClick={() => setIsModalOpen(true)}
          ></CustomButton>
        }
        onRowClick={(row) => console.log("Row clicked:", row)}
      />

      <CustomModal
        isOpen={isModalOpen}
        title={modalTitleMap[filterType]}
        onClose={handleCloseModal}
      >
        {filterType === "processed" ? (
          <RecipeFormWrapper onFormSubmit={handleCloseModal} />
        ) : (
          <InventoriesForm
            onFormSubmit={handleCloseModal}
            inventoryType={filterType}
          />
        )}
      </CustomModal>

      <CustomModal
        isOpen={isAddModalOpen}
        title={`Agregar a: ${selectedItem?.name || ""}`}
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
