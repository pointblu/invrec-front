import {
  CustomTable,
  CustomContainer,
  CustomButton,
  CustomModal,
  CustomInput,
} from "../components";
import { TbCashRegister, TbTrash } from "react-icons/tb";
import { SalesForm } from "./SalesForm";
import { useCallback, useEffect, useState } from "react";
import { getAllSales, deleteSale } from "../services/api";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";

export function Sales() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    totalItems: 0,
  });

  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllSales(
        startDate,
        endDate,
        pagination.page,
        10
      );

      setSales(response?.data?.result || []);
      setPagination((prev) => ({
        ...prev,
        totalItems: response?.data?.count || 0,
      }));
    } catch (err) {
      setError(err.message || "Error al cargar las ventas");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, startDate, endDate]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchSales(); // Recargar datos después de cerrar el modal
  };

  const handleDelete = async (saleId) => {
    try {
      await deleteSale(saleId);
      toast.success("Venta eliminada correctamente");
      fetchSales(); // recargar lista
    } catch (error) {
      console.error("Error al eliminar la venta:", error);
      toast.error("Error al eliminar la venta");
    }
  };

  const confirmDeleteToast = (saleId) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>¿Estás seguro de eliminar esta venta?</p>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
              marginTop: "0.5rem",
            }}
          >
            <button
              onClick={async () => {
                await handleDelete(saleId);
                closeToast(); // cerrar el toast
              }}
              style={{
                backgroundColor: "#d9534f",
                color: "white",
                border: "none",
                padding: "4px 8px",
                cursor: "pointer",
              }}
            >
              Eliminar
            </button>
            <button
              onClick={closeToast}
              style={{
                backgroundColor: "#ccc",
                border: "none",
                padding: "4px 8px",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  function renderActionsCell({ row }, isDisabled = false) {
    const saleId = row.original.id;

    return (
      <CustomButton
        icon={<TbTrash />}
        onClick={() => !isDisabled && confirmDeleteToast(saleId)}
        disabled={isDisabled}
        customStyle={{
          default: {
            backgroundColor: isDisabled ? "#cccccc" : "#af574cff",
            border: "1px solid white",
            color: "white",
            width: "1.8rem",
            height: "1.8rem",
            cursor: isDisabled ? "not-allowed" : "pointer",
            opacity: isDisabled ? 0.6 : 1,
          },
          hover: {
            backgroundColor: isDisabled ? "#cccccc" : "#af4f4cff",
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

  const columns = [
    {
      header: "Fecha",
      accessorKey: "date",
      cell: (info) => {
        const timestamp = info.getValue(); // Puede ser string (ISO) o número (ms)
        const date = new Date(timestamp); // Convierte a objeto Date

        return date.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          timeZone: "UTC", // Opcional: si quieres forzar UTC
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
      accessorKey: "quantity",
    },
    {
      header: "Unidad",
      accessorKey: "inventory.measurementUnit",
      cell: ({ getValue }) => {
        const value = getValue();
        switch (value) {
          case "grams":
            return "Kg";
          case "liters":
            return "ml";
          case "units":
            return "Un";
          default:
            return value;
        }
      },
    },
    {
      header: "Precio Unitario ($)",
      accessorKey: "unitPrice",
    },
    {
      header: "Total ($)",
      accessorKey: "total",
    },
    {
      header: "Ganancia ($)",
      accessorKey: "totalProfit",
    },
    {
      header: "Acciones",
      id: "actions",
      cell: ({ row }) => renderActionsCell({ row }),
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
        <h1>Ventas</h1>
        <CustomTable
          data={sales}
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
              icon={
                <TbCashRegister
                  data-tooltip-id="tooltip-id"
                  data-tooltip-content="Crear venta"
                />
              }
              onClick={() => setIsModalOpen(true)}
            />
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
          title={"Ventas"}
          onClose={handleCloseModal}
        >
          <SalesForm onFormSubmit={handleCloseModal} />
        </CustomModal>
      </CustomContainer>
    </>
  );
}
