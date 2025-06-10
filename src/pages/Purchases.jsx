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
import { getAllPurchases } from "../services/api";

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
  }, [pagination.page, startDate, endDate]); // Dependencias de la función

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchPurchases(); // Recargar datos después de cerrar el modal
  };

  const columns = [
    {
      header: "Fecha",
      accessorKey: "purchaseDate",
      cell: (info) => {
        const date = new Date(info.getValue());
        return date.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
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
      header: "Costo ($)",
      accessorKey: "price",
    },
  ];
  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <CustomContainer>
      <h1>Compras</h1>
      <CustomTable
        data={purchases}
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
            icon={<MdOutlineShoppingCart />}
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
  );
}
