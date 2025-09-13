import { GiFlour } from "react-icons/gi";
import { MdPercent } from "react-icons/md";
import { FaBook, FaRecycle } from "react-icons/fa6";
import { HiPlus } from "react-icons/hi";
import {
  CustomTable,
  CustomContainer,
  CustomButton,
  CustomModal,
} from "../components";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { InventoriesForm } from "./InventoriesForm";
import { QuantityForm } from "./QuantityForm";
import {
  deleteInventory,
  getAllInventories,
  getInventoryById,
  setPercentageProfit,
} from "../services/api";
import { RecipeFormWrapper } from "./RecipeFormWrapper";
import styled from "styled-components";
import { toast } from "react-toastify";
import { ProfitForm } from "./profitForm";
import { Tooltip } from "react-tooltip";
import { IoMdTrash } from "react-icons/io";

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

function renderIngredientsCell({ getValue }) {
  const ingredients = getValue();

  if (!ingredients || ingredients.length === 0) {
    return <span>No tiene ingredientes</span>;
  }
  const formatUnit = (unit) => {
    switch (unit) {
      case "units":
        return "Un.";
      case "grams":
        return "Kg.";
      case "liters":
        return "ml.";
      default:
        return unit;
    }
  };
  return (
    <IngredientsContainer>
      <IngredientsSummary>
        {ingredients.length} ingrediente{ingredients.length !== 1 ? "s" : ""}
      </IngredientsSummary>
      <IngredientsDropdown>
        {ingredients.map((ing) => (
          <IngredientItem key={ing.id}>
            {ing.quantity} {formatUnit(ing.ingredient.measurementUnit)} de{" "}
            {ing.ingredient.name}
          </IngredientItem>
        ))}
      </IngredientsDropdown>
    </IngredientsContainer>
  );
}
renderIngredientsCell.propTypes = {
  getValue: PropTypes.func.isRequired,
};

function RenderDescriptionCell({ getValue }) {
  // Cambiado para usar getValue
  const value = getValue();
  return (
    <DescriptionContainer>
      <DescriptionSummary>{value}</DescriptionSummary>
      <DescriptionTooltip>{value}</DescriptionTooltip>
    </DescriptionContainer>
  );
}

RenderDescriptionCell.propTypes = {
  getValue: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

export function Inventories({ title, filterType }) {
  const [modalMode, setModalMode] = useState(null);
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

      if (filterType === "processed") {
        const itemsWithIngredients = await Promise.all(
          filtered.map(async (item) => {
            try {
              // Asumo que tienes una función getInventoryById en tus servicios
              const detailResponse = await getInventoryById(item.id);
              return {
                ...item,
                ingredients: detailResponse.data?.ingredients || [],
              };
            } catch (err) {
              console.error(`Error loading details for ${item.id}:`, err);
              return {
                ...item,
                ingredients: [],
              };
            }
          })
        );
        setData(itemsWithIngredients.slice(startIndex, endIndex));
      } else {
        setData(filtered.slice(startIndex, endIndex)); // solo 10 visibles
      }
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
    fetchData();
  };

  const handleOpenAddModal = (item) => {
    if (!item) return;
    setSelectedItem(item);
    setModalMode("addQuantity");
    setIsAddModalOpen(true);
  };

  const handleAddQuantity = ({ quantity }) => {
    console.log("Agregar cantidad:", quantity, "al item:", selectedItem);
    handleCloseAddModal();
    fetchData();
  };

  const [isProfitModalOpen, setIsProfitModalOpen] = useState(false);
  const [selectedProfitItem, setSelectedProfitItem] = useState(null);

  const openProfitModal = (item) => {
    setSelectedProfitItem(item);
    setIsProfitModalOpen(true);
  };

  const closeProfitModal = () => {
    setIsProfitModalOpen(false);
    setSelectedProfitItem(null);
  };

  const handleDelete = async (item) => {
    try {
      await deleteInventory(item.id);
      toast.success(`Eliminacion exitosa de "${item.name}"`, {
        position: "top-right",
        autoClose: 3000,
      });
      fetchData(); // recarga la tabla
    } catch (error) {
      toast.error(`${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Error eliminando inventario:", error);
    }
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
    ...(filterType === "processed"
      ? [
          {
            header: "Ingredientes",
            accessorKey: "ingredients",
            cell: renderIngredientsCell,
          },
        ]
      : []),
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
      header: "Costo prom. ($)",
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

    ...(filterType === "processed"
      ? [
          {
            header: "Ganancia",
            accessorKey: "actions",
            cell: ({ row }) => {
              const { profitPercentage } = row.original;

              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ fontSize: "0.875rem", color: "#333" }}>
                    {profitPercentage ? `${profitPercentage}` : "—"}
                  </span>
                  <CustomButton
                    icon={<MdPercent />}
                    onClick={() => openProfitModal(row.original)}
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
                </div>
              );
            },
          },
        ]
      : []),
    {
      header: "Acciones",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div style={{ display: "flex", gap: "8px" }}>
            <CustomButton
              icon={<IoMdTrash />}
              onClick={() => handleDelete(item)}
              customStyle={{
                default: {
                  backgroundColor: "#dd1f1fff",
                  border: "1px solid white",
                  color: "white",
                  width: "1.8rem",
                  height: "1.8rem",
                },
                hover: {
                  backgroundColor: "#da5959ff",
                  transform: "scale(1.05)",
                },
                active: {
                  backgroundColor: "#c20c0cff",
                  transform: "scale(0.95)",
                },
              }}
            />
          </div>
        );
      },
    },
  ];

  const iconsMap = {
    raw: (
      <GiFlour
        data-tooltip-id="tooltip-id"
        data-tooltip-content="Crear insumo"
      />
    ),
    processed: (
      <FaBook
        data-tooltip-id="tooltip-id"
        data-tooltip-content="Crear producto"
      />
    ),
    returned: (
      <FaRecycle
        data-tooltip-id="tooltip-id"
        data-tooltip-content="Crear reutilizable"
      />
    ),
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
    <>
      <Tooltip
        id="tooltip-id"
        place="left"
        style={{
          backgroundColor: "#9247FC",
          color: "#fff",
          padding: "6px 12px",
          borderRadius: "4px",
          fontSize: "0.9rem",
        }}
      />
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
          title={
            modalMode === "edit"
              ? `Editar: ${selectedItem?.name || ""}`
              : `Agregar a: ${selectedItem?.name || ""}`
          }
          onClose={handleCloseAddModal}
        >
          {selectedItem ? (
            modalMode === "edit" ? (
              selectedItem.type === "processed" ? (
                <RecipeFormWrapper
                  onFormSubmit={handleCloseAddModal}
                  initialData={selectedItem}
                />
              ) : (
                <InventoriesForm
                  onFormSubmit={handleCloseAddModal}
                  inventoryType={filterType}
                  initialData={selectedItem}
                />
              )
            ) : (
              <QuantityForm
                onSubmit={handleAddQuantity}
                onClose={handleCloseAddModal}
                item={selectedItem}
              />
            )
          ) : (
            <p>No se ha seleccionado ningún item</p>
          )}
        </CustomModal>
        <CustomModal
          isOpen={isProfitModalOpen}
          title={`Asignar ganancia a: ${selectedProfitItem?.name || ""}`}
          onClose={closeProfitModal}
        >
          {selectedProfitItem && (
            <ProfitForm
              item={selectedProfitItem}
              onSubmit={async ({ inventoryId, profitPercentage }) => {
                try {
                  await setPercentageProfit(inventoryId, profitPercentage);
                  toast.success("Porcentaje de ganancia actualizado");
                  closeProfitModal();
                  fetchData();
                } catch (error) {
                  toast.error("Error al actualizar la ganancia");
                  console.error(error);
                }
              }}
              onClose={closeProfitModal}
            />
          )}
        </CustomModal>
      </CustomContainer>
    </>
  );
}

Inventories.propTypes = {
  title: PropTypes.string.isRequired,
  filterType: PropTypes.string.isRequired,
};

const IngredientsContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`;

const IngredientsSummary = styled.div`
  padding: 4px 8px;
  cursor: default;
`;

const IngredientsDropdown = styled.div`
  display: none;
  position: absolute;
  background: ${({ theme }) => theme.bg2};
  min-width: 300px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 4px;
  padding: 8px;
  max-height: 500px;
  overflow-y: auto;
  left: 0;
  top: 100%;
  border: 1px solid #ddd;

  ${IngredientsContainer}:hover & {
    display: block;
  }
`;

const IngredientItem = styled.div`
  padding: 4px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

// Descriptioncell

const DescriptionContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`;

const DescriptionSummary = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
  cursor: default;
`;

const DescriptionTooltip = styled.div`
  display: none;
  position: absolute;
  background: ${({ theme }) => theme.bg2};
  min-width: 300px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 4px;
  padding: 8px;
  left: 0;
  top: 100%;
  border: 1px solid #ddd;
  white-space: normal;
  word-wrap: break-word;
  max-width: 500px;

  ${DescriptionContainer}:hover & {
    display: block;
  }
`;
