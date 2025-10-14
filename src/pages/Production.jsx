import { useState, useEffect, useCallback } from "react";
import {
  CustomTable,
  CustomContainer,
  CustomButton,
  CustomModal,
  CustomInput,
  ProductionPrintButton,
} from "../components";
import { FaHammer } from "react-icons/fa";
import { HiCheck } from "react-icons/hi";
import { IoMdTrash } from "react-icons/io";
import { QuantityForm } from "./QuantityForm";
import { ProductionForm } from "./ProductionForm";
import {
  getAllProduction,
  madeProduction,
  deleteProduction,
} from "../services/api";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";

export function Production() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    totalItems: 0,
  });

  const fetchProductionData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllProduction(
        startDate,
        endDate,
        pagination.page,
        10
      );

      if (response.success) {
        setTableData(response?.data.result);
        setPagination((prev) => ({
          ...prev,
          totalItems: response?.data.count || 0,
        }));
      }
    } catch (err) {
      setError(err.message || "Error al cargar los datos de producción");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, startDate, endDate]);

  useEffect(() => {
    fetchProductionData();
  }, [fetchProductionData]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchProductionData();
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setSelectedItem(null);
    fetchProductionData();
  };

  const handleOpenAddModal = (item) => {
    if (!item) return;
    setSelectedItem(item);
    setIsAddModalOpen(true);
  };

  const handleDeleteProduction = async (id) => {
    try {
      await deleteProduction(id);
      toast.success("Producción eliminada con éxito", {
        position: "top-right",
        autoClose: 3000,
      });
      fetchProductionData(); // Recargar la lista
    } catch (err) {
      const errorMessage = err?.message || "Error al eliminar la producción";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Error al eliminar producción:", err);
    }
  };

  const handleAddQuantity = async ({ quantity }) => {
    try {
      if (!selectedItem || !quantity) return;

      console.log("Agregar cantidad:", quantity, "al item:", selectedItem);

      const bodyProduction = {
        made: parseFloat(quantity),
      };

      await madeProduction(selectedItem.id, bodyProduction);
      toast.success("Producción finalizada con éxito", {
        onClose: () => handleCloseAddModal(),
      });
    } catch (error) {
      console.error("Error al actualizar la producción:", error);
      toast.error(error?.message || "Error al finalizar la producción", {
        onClose: () => handleCloseAddModal(),
      });
    }
  };

  const formatStatus = (status) => {
    return status === "en_proceso" ? "En proceso" : "Hecho";
  };

  function renderCheckButton({ row }, openAddModal, isDisabled = false) {
    return (
      <CustomButton
        icon={<HiCheck />}
        onClick={() => !isDisabled && openAddModal(row.original)}
        disabled={isDisabled}
        customStyle={{
          default: {
            backgroundColor: isDisabled ? "#cccccc" : "#4CAF50",
            border: "1px solid white",
            color: "white",
            width: "1.8rem",
            height: "1.8rem",
            cursor: isDisabled ? "not-allowed" : "pointer",
            opacity: isDisabled ? 0.6 : 1,
          },
          hover: {
            backgroundColor: isDisabled ? "#cccccc" : "#4caf82",
            transform: isDisabled ? "none" : "scale(1.05)",
          },
          active: {
            backgroundColor: isDisabled ? "#cccccc" : "#af4cab",
            transform: isDisabled ? "none" : "scale(0.95)",
          },
        }}
      />
    );
  }

  function renderDeleteButton({ row }, handleDelete, isDisabled = false) {
    return (
      <CustomButton
        icon={<IoMdTrash />}
        onClick={() => !isDisabled && handleDelete(row.original.id)}
        disabled={isDisabled}
        customStyle={{
          default: {
            backgroundColor: isDisabled ? "#cccccc" : "#dd1f1fff",
            border: "1px solid white",
            color: "white",
            width: "1.8rem",
            height: "1.8rem",
            marginLeft: "5px",
            cursor: isDisabled ? "not-allowed" : "pointer",
            opacity: isDisabled ? 0.6 : 1,
          },
          hover: {
            backgroundColor: isDisabled ? "#cccccc" : "#da5959ff",
            transform: isDisabled ? "none" : "scale(1.05)",
          },
          active: {
            backgroundColor: isDisabled ? "#cccccc" : "#c20c0cff",
            transform: isDisabled ? "none" : "scale(0.95)",
          },
        }}
      />
    );
  }

  const columns = [
    {
      header: "Fecha",
      accessorKey: "productionDate",
      cell: (info) => {
        const dateStr = info.getValue(); // "2025-06-20"
        const [year, month, day] = dateStr.split("-");
        const date = new Date(Date.UTC(year, month - 1, day));

        return date.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          timeZone: "UTC", // Forzar a mostrar en UTC
        });
      },
    },
    {
      header: "Código",
      accessorKey: "inventory.code",
    },
    {
      header: "Producto",
      accessorKey: "inventory.name",
    },
    {
      header: "Cantidad",
      accessorFn: (row) =>
        row.status === "en_proceso" ? row.toMade : row.made,
      cell: ({ getValue }) => parseFloat(getValue()).toFixed(2),
    },
    {
      header: "Costo ($)",
      accessorFn: (row) => {
        const quantity = row.status === "en_proceso" ? row.toMade : row.made;
        return (parseFloat(quantity) * parseFloat(row.inventory.cost)).toFixed(
          2
        );
      },
    },
    {
      header: "Estado",
      accessorKey: "status",
      cell: ({ getValue }) => formatStatus(getValue()),
    },
    {
      header: "Acciones",
      accessorKey: "actions",
      cell: ({ row }) => {
        const isDone = row.original.status === "hecho";
        return (
          // 💡 Contenedor con display: flex para alinear los botones
          <div style={{ display: "flex", gap: "5px" }}>
            {/* Botón de Finalizar Producción */}
            {renderCheckButton({ row }, handleOpenAddModal, isDone)}

            {/* Botón de Eliminar Producción */}
            {renderDeleteButton({ row }, handleDeleteProduction, isDone)}
          </div>
        );
      },
    },
  ];

  if (loading) return <div>Cargando...</div>;
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
        <h1>Producción</h1>
        <CustomTable
          data={tableData}
          columns={columns}
          pagination={{
            page: pagination.page,
            totalItems: pagination.totalItems,
            pageSize: 10,
          }}
          onPageChange={(newPage) =>
            setPagination((prev) => ({ ...prev, page: newPage }))
          }
          filtering={globalFilter}
          onFilteringChange={setGlobalFilter}
          customButtons={
            <>
              <CustomButton
                icon={
                  <FaHammer
                    data-tooltip-id="tooltip-id"
                    data-tooltip-content="Crear orden de producción"
                  />
                }
                onClick={() => setIsModalOpen(true)}
              ></CustomButton>
              <ProductionPrintButton bodyProduction={{ startDate, endDate }} />
            </>
          }
          customFilters={[
            <CustomInput
              key="start"
              id="startDate"
              label="Desde"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />,
            <CustomInput
              key="end"
              id="endDate"
              label="Hasta"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />,
          ]}
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
          title={` ${selectedItem?.inventory?.name || ""}`}
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
    </>
  );
}
