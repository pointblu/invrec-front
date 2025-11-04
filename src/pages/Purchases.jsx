import {
  CustomTable,
  CustomContainer,
  CustomButton,
  CustomModal,
  CustomInput,
} from "../components";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useCallback, useEffect, useState } from "react";
import { PurchaseForm } from "./PurchaseForm";
import { deletePurchase, getAllPurchases } from "../services/api";
import { Tooltip } from "react-tooltip";
import { IoMdTrash } from "react-icons/io";
import { toast } from "react-toastify";

export function Purchases() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    totalItems: 0,
  });
  // Nuevo: dataset completo para filtrar sin paginación manual
  const [fullPurchases, setFullPurchases] = useState([]);

  const fetchPurchases = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllPurchases(
        startDate,
        endDate,
        pagination.page,
        10
      );

      setPurchases(response?.data?.result || []);
      setPagination((prev) => ({
        ...prev,
        totalItems: response?.data?.count || 0,
      }));
    } catch (err) {
      setError(err.message || "Error al cargar las compras");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, startDate, endDate]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  // Nuevo: cargar dataset completo cuando cambian los filtros de fecha
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const resp = await getAllPurchases(startDate, endDate, 1, 3000);
        setFullPurchases(resp?.data?.result || []);
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        // se puede loguear el error si es necesario
      }
    };
    fetchAll();
  }, [startDate, endDate]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [globalFilter]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchPurchases(); // Recargar datos después de cerrar el modal
  };

  const handleDeletePurchase = async (id) => {
    try {
      await deletePurchase(id);
      toast.success("Eliminación exitosa", {
        position: "top-right",
        autoClose: 3000,
      });
      fetchPurchases(); // recargar la lista
    } catch (err) {
      toast.error(err?.message || "Error al eliminar la compra", {
        position: "top-right",
        autoClose: 3000,
      });
      alert(`Error al eliminar la compra: ${err?.message || err}`);
    }
  };

  const columns = [
    {
      header: "Fecha",
      accessorKey: "purchaseDate",
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
      header: "Insumo",
      accessorKey: "inventory.name",
    },
    {
      header: "Marca",
      accessorKey: "brand",
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
      header: "Costo ($)",
      accessorKey: "price",
    },
    {
      header: "Acciones",
      cell: ({ row }) => (
        <CustomButton
          icon={<IoMdTrash />}
          onClick={() => handleDeletePurchase(row.original.id)}
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
      ),
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
        <h1>Compras</h1>
        <CustomTable
          data={globalFilter?.trim() ? fullPurchases : purchases}
          columns={columns}
          pagination={
            globalFilter?.trim()
              ? null
              : {
                  page: pagination.page,
                  totalItems: pagination.totalItems,
                  pageSize: 10,
                }
          }
          onPageChange={handlePageChange}
          filtering={globalFilter}
          onFilteringChange={setGlobalFilter}
          customButtons={
            <CustomButton
              icon={
                <MdOutlineShoppingCart
                  data-tooltip-id="tooltip-id"
                  data-tooltip-content="Crear compra"
                />
              }
              onClick={() => setIsModalOpen(true)}
            ></CustomButton>
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
          title={"Compras"}
          onClose={handleCloseModal}
        >
          <PurchaseForm onFormSubmit={handleCloseModal} />
        </CustomModal>
      </CustomContainer>
    </>
  );
}
