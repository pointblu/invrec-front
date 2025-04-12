import { CustomContainer, CustomChart } from "../components";
import data from "../sales_data.json";
import styled from "styled-components";

// Procesamiento de datos
const processDataByDate = (data) => {
  const groupedData = {};

  data.forEach((item) => {
    const date = item.createdAt;
    const totalValue = parseFloat(item.total.replace(/[^\d.-]/g, ""));

    if (!groupedData[date]) {
      groupedData[date] = {
        date: formatDate(date),
        total: 0,
        quantity: 0,
        products: 0,
      };
    }

    groupedData[date].total += totalValue;
    groupedData[date].quantity += item.quantity;
    groupedData[date].products += 1;
  });

  return Object.values(groupedData).map((item) => ({
    ...item,
    total: parseFloat(item.total.toFixed(2)),
  }));
};

const formatDate = (dateString) => {
  const [day, month] = dateString.split("/");
  return `${day}/${month}`;
};

// Componente para mostrar 4 gráficos en cuadrantes
export function Statics() {
  const chartData = processDataByDate(data);

  // Datos para el gráfico circular (ejemplo por categoría)
  const categoryData = [
    { name: "Panaderia", value: 300 },
    { name: "Pasteleria", value: 150 },
    { name: "Bebidas", value: 40 },
    { name: "otros", value: 10 },
  ];

  return (
    <CustomContainer>
      <h1>Panel de gestión</h1>

      <DashboardGrid>
        {/* Cuadrante 1: Ventas totales por fecha */}

        <ChartContainer>
          <CustomChart
            type="bar"
            data={chartData}
            title="Ventas Diarias (Total)"
            colors={["#4FD1C5"]}
            barProps={[
              { dataKey: "total", name: "Total Ventas", radius: [4, 4, 0, 0] },
            ]}
            xAxisDataKey="date"
          />
        </ChartContainer>

        {/* Cuadrante 2: Cantidad de productos vendidos */}
        <ChartContainer>
          <CustomChart
            type="line"
            data={chartData}
            title="Productos Vendidos"
            colors={["#8dc2f0"]}
            lineProps={[
              { dataKey: "products", name: "Productos", strokeWidth: 3 },
            ]}
            xAxisDataKey="date"
          />
        </ChartContainer>

        {/* Cuadrante 3: Distribución por categorías */}
        <ChartContainer>
          <CustomChart
            type="pie"
            data={categoryData}
            title="Distribución por Categoría"
            colors={["#8dc2f0", "#00C49F", "#FFBB28", "#FF8042"]}
          />
        </ChartContainer>

        {/* Cuadrante 4: Cantidad vs Ventas */}
        <ChartContainer>
          <CustomChart
            type="bar"
            data={chartData}
            title="Cantidad vs Ventas"
            colors={["#4FD1C5", "#FF8042"]}
            barProps={[
              { dataKey: "quantity", name: "Cantidad", radius: [4, 4, 0, 0] },
              { dataKey: "total", name: "Ventas", radius: [4, 4, 0, 0] },
            ]}
            xAxisDataKey="date"
          />
        </ChartContainer>
      </DashboardGrid>
    </CustomContainer>
  );
}

// Estilos para el grid de 4 cuadrantes
const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 20px;
  width: 80%;
  height: calc(100vh - 100px); /* Ajusta según tu header */

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, 1fr);
  }
`;

const ChartContainer = styled.div`
  background: ${({ theme }) => theme.cardBackground || "#fff"};
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;
