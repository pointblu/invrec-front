import {
  CustomContainer,
  CustomChart,
  CustomInput,
  CustomButton,
} from "../components";
import { useCallback, useEffect, useState } from "react";
import {
  getAllPurchases,
  getAllProduction,
  getAllSales,
} from "../services/api";
import styled from "styled-components";

export function Statics() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [salesByProduct, setSalesByProduct] = useState([]);
  const [productionByProduct, setProductionByProduct] = useState([]);
  const [purchasesByItemQty, setPurchasesByItemQty] = useState([]);
  const [, setPurchasesSpendPie] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Traer todas las páginas para asegurar datos completos del rango
  const fetchAll = useCallback(async (fn, sDate, eDate, take = 1000) => {
    const all = [];
    let page = 1;
    try {
      while (true) {
        const resp = await fn(sDate, eDate, page, take);
        // El interceptor de axios retorna response.data directamente
        const rData = resp?.data ?? resp;
        const items = rData?.result ?? [];
        const count = rData?.count ?? items.length;

        if (!items.length) break;
        all.push(...items);
        if (all.length >= count) break;

        page += 1;
      }
    } catch (err) {
      console.error("Error al traer datos:", err);
      throw err;
    }
    return all;
  }, []);

  // Utilidad para mostrar unidades como en las tablas
  const mapUnitLabel = (value) => {
    switch (value) {
      case "grams":
        return "Kg";
      case "liters":
        return "ml";
      case "units":
        return "Un";
      default:
        return value || "Un";
    }
  };

  // Utilidades de agregación por producto/insumo
  const aggregateSalesByProduct = (items) => {
    const map = new Map();
    items.forEach((it) => {
      const name = it?.inventory?.name ?? "Desconocido";
      const unitLabel = mapUnitLabel(it?.inventory?.measurementUnit);
      const quantity = parseFloat(it?.quantity) || 0;
      const total = parseFloat(it?.total) || 0;
      const profit = parseFloat(it?.totalProfit) || 0;

      const key = `${name}__${unitLabel}`;
      const entry = map.get(key) || {
        name,
        unitLabel,
        nameUnit: `${name} (${unitLabel})`,
        quantity: 0,
        total: 0,
        profit: 0,
      };
      entry.quantity += quantity;
      entry.total += total;
      entry.profit += profit;
      map.set(key, entry);
    });
    return Array.from(map.values()).map((e) => ({
      ...e,
      quantity: parseFloat(e.quantity.toFixed(2)),
      total: parseFloat(e.total.toFixed(2)),
      profit: parseFloat(e.profit.toFixed(2)),
    }));
  };

  const aggregateProductionByProduct = (items) => {
    const map = new Map();
    items.forEach((it) => {
      const name = it?.inventory?.name ?? "Desconocido";
      const unitLabel = mapUnitLabel(it?.inventory?.measurementUnit);
      const planned = parseFloat(it?.toMade) || 0;
      const made = parseFloat(it?.made) || 0;

      const key = `${name}__${unitLabel}`;
      const entry = map.get(key) || {
        name,
        unitLabel,
        nameUnit: `${name} (${unitLabel})`,
        planned: 0,
        made: 0,
      };
      entry.planned += planned;
      entry.made += made;
      map.set(key, entry);
    });
    return Array.from(map.values()).map((e) => ({
      ...e,
      planned: parseFloat(e.planned.toFixed(2)),
      made: parseFloat(e.made.toFixed(2)),
    }));
  };

  const aggregatePurchasesByItem = (items) => {
    const map = new Map();
    items.forEach((it) => {
      const name = it?.inventory?.name ?? "Desconocido";
      const unitLabel = mapUnitLabel(it?.inventory?.measurementUnit);
      const quantity = parseFloat(it?.quantity) || 0;
      const spend = parseFloat(it?.price) || 0;

      const key = `${name}__${unitLabel}`;
      const entry = map.get(key) || {
        name,
        unitLabel,
        nameUnit: `${name} (${unitLabel})`,
        quantity: 0,
        spend: 0,
      };
      entry.quantity += quantity;
      entry.spend += spend;
      map.set(key, entry);
    });
    return Array.from(map.values()).map((e) => ({
      ...e,
      quantity: parseFloat(e.quantity.toFixed(2)),
      spend: parseFloat(e.spend.toFixed(2)),
    }));
  };

  // Formateadores para tooltips (muestran unidad en cantidades)
  const tooltipFormatterGeneral = (value, name, item) => {
    const dataKey = item?.dataKey;
    const unit = item?.payload?.unitLabel || "";
    if (dataKey === "quantity" || dataKey === "planned" || dataKey === "made") {
      return `${Number(value).toFixed(2)} ${unit}`;
    }
    if (dataKey === "total" || dataKey === "spend" || dataKey === "profit") {
      return `$ ${Number(value).toFixed(2)}`;
    }
    return Number(value).toFixed(2);
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [allSales, allProduction, allPurchases] = await Promise.all([
        fetchAll(getAllSales, startDate, endDate),
        fetchAll(getAllProduction, startDate, endDate),
        fetchAll(getAllPurchases, startDate, endDate),
      ]);

      // Ventas por producto (mostrar todos)
      const salesAgg = aggregateSalesByProduct(allSales);
      setSalesByProduct(salesAgg);

      // Producción por producto (mostrar todos)
      const prodAgg = aggregateProductionByProduct(allProduction);
      setProductionByProduct(prodAgg);

      // Compras por insumo (mostrar todos)
      const purchAgg = aggregatePurchasesByItem(allPurchases);
      setPurchasesByItemQty(purchAgg);
      setPurchasesSpendPie(
        purchAgg.map((e) => ({ name: e.name, value: e.spend }))
      );
    } catch (err) {
      setError(err?.message || "Error al cargar estadísticas");
    } finally {
      setLoading(false);
    }
  }, [fetchAll, startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Cálculo de altura dinámica para barras verticales y scroll interno
  const computeChartHeight = (
    itemsLength,
    perItem = 32,
    minHeight = 350,
    maxHeight = 800
  ) =>
    Math.max(minHeight, Math.min(maxHeight, Math.ceil(itemsLength * perItem)));

  // Formato de moneda en pesos
  const formatCurrency = (value) =>
    `$ ${Number(value).toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // Totales para cards de compras
  const totalSpend = purchasesByItemQty.reduce(
    (sum, e) => sum + (parseFloat(e.spend) || 0),
    0
  );
  const totalDistinctItems = purchasesByItemQty.length;
  // Totales de Ventas
  const totalSalesAmount = salesByProduct.reduce(
    (sum, e) => sum + (parseFloat(e.total) || 0),
    0
  );
  const totalSalesProfit = salesByProduct.reduce(
    (sum, e) => sum + (parseFloat(e.profit) || 0),
    0
  );

  return (
    <CustomContainer padding="0.5rem">
      <h1>Panel de gestión</h1>
      {/* Filtros por rango de fechas */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <CustomInput
          id="startDate"
          label="Desde"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <CustomInput
          id="endDate"
          label="Hasta"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <CustomButton onClick={fetchData}>Actualizar</CustomButton>
      </div>

      {loading && <div>Cargando...</div>}
      {error && <div>Error: {error}</div>}

      {!loading && !error && (
        <DashboardGrid style={{ marginBottom: "2rem" }}>
          {/* Ventas: barras verticales con scroll vertical interno */}
          <ChartContainer>
            <TitleRow>
              <h3>Ventas por Producto</h3>
              <StatsGroup>
                <StatCard>
                  <StatLabel>Total vendido</StatLabel>
                  <StatValue>{formatCurrency(totalSalesAmount)}</StatValue>
                </StatCard>
                <StatCard>
                  <StatLabel>Ganancia</StatLabel>
                  <StatValue>{formatCurrency(totalSalesProfit)}</StatValue>
                </StatCard>
              </StatsGroup>
            </TitleRow>
            <ScrollWrapperY>
              <CustomChart
                type="bar"
                data={salesByProduct}
                title=""
                colors={["#4FD1C5", "#FF8042", "#9247FC"]}
                barProps={[
                  { dataKey: "quantity", name: "Cantidad" },
                  { dataKey: "total", name: "Ingresos ($)" },
                  { dataKey: "profit", name: "Ganancia ($)" },
                ]}
                layout="vertical"
                xAxisProps={{
                  type: "number",
                  tickFormatter: (v) => Number(v).toFixed(0),
                }}
                yAxisProps={{
                  type: "category",
                  dataKey: "nameUnit",
                  width: 200,
                  interval: 0,
                }}
                responsive={true}
                width="100%"
                height={computeChartHeight(salesByProduct.length)}
                barSize={12}
                chartProps={{ barCategoryGap: 8 }}
                tooltipFormatter={tooltipFormatterGeneral}
              />
            </ScrollWrapperY>
          </ChartContainer>

          {/* Producción: barras verticales apiladas Planificado vs Hecho */}
          <ChartContainer>
            <ScrollWrapperY>
              <CustomChart
                type="bar"
                data={productionByProduct}
                title="Producción por Producto (Planificado vs Hecho)"
                colors={["#8dc2f0", "#00C49F"]}
                barProps={[
                  { dataKey: "planned", name: "Planificado", stackId: "prod" },
                  { dataKey: "made", name: "Hecho", stackId: "prod" },
                ]}
                layout="vertical"
                xAxisProps={{
                  type: "number",
                  tickFormatter: (v) => Number(v).toFixed(2),
                }}
                yAxisProps={{
                  type: "category",
                  dataKey: "nameUnit",
                  width: 200,
                  interval: 0,
                }}
                responsive={true}
                width="100%"
                height={computeChartHeight(productionByProduct.length)}
                barSize={12}
                chartProps={{ barCategoryGap: 8 }}
                tooltipFormatter={tooltipFormatterGeneral}
              />
            </ScrollWrapperY>
          </ChartContainer>

          {/* Compras: gasto por insumo como barras verticales */}
          <ChartContainer $mb="1rem">
            <TitleRow>
              <h3>Gasto por Insumo</h3>
              <StatsGroup>
                <StatCard>
                  <StatLabel>Total</StatLabel>
                  <StatValue>{formatCurrency(totalSpend)}</StatValue>
                </StatCard>
              </StatsGroup>
            </TitleRow>
            <ScrollWrapperY>
              <CustomChart
                type="bar"
                data={purchasesByItemQty}
                title=""
                colors={["#9247FC"]}
                barProps={[{ dataKey: "spend", name: "Gasto ($)" }]}
                layout="vertical"
                xAxisProps={{
                  type: "number",
                  tickFormatter: (v) => Number(v).toFixed(2),
                }}
                yAxisProps={{
                  type: "category",
                  dataKey: "name",
                  width: 200,
                  interval: 0,
                }}
                responsive={true}
                width="100%"
                height={computeChartHeight(purchasesByItemQty.length)}
                barSize={12}
                chartProps={{ barCategoryGap: 8 }}
                tooltipFormatter={tooltipFormatterGeneral}
              />
            </ScrollWrapperY>
          </ChartContainer>

          {/* Compras: cantidad por insumo en barras verticales */}
          <ChartContainer $mb="1rem">
            <TitleRow>
              <h3>Cantidad Comprada por Insumo</h3>
              <StatsGroup>
                <StatCard>
                  <StatLabel>Items</StatLabel>
                  <StatValue>{totalDistinctItems}</StatValue>
                </StatCard>
              </StatsGroup>
            </TitleRow>
            <ScrollWrapperY>
              <CustomChart
                type="bar"
                data={purchasesByItemQty}
                title=""
                colors={["#FFBB28"]}
                barProps={[{ dataKey: "quantity", name: "Cantidad" }]}
                layout="vertical"
                xAxisProps={{
                  type: "number",
                  tickFormatter: (v) => Number(v).toFixed(0),
                }}
                yAxisProps={{
                  type: "category",
                  dataKey: "nameUnit",
                  width: 200,
                  interval: 0,
                }}
                responsive={true}
                width="100%"
                height={computeChartHeight(purchasesByItemQty.length)}
                barSize={12}
                chartProps={{ barCategoryGap: 8 }}
                tooltipFormatter={tooltipFormatterGeneral}
              />
            </ScrollWrapperY>
          </ChartContainer>
        </DashboardGrid>
      )}
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
  /* quitar altura fija para respetar el padding del contenedor */
  /* height: calc(100vh - 100px); */

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
  margin-bottom: ${({ $mb }) => $mb || "0"};
`;

const ScrollWrapperY = styled.div`
  width: 100%;
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
`;

// Estilos para títulos y cards al lado del título
const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;

  h3 {
    margin: 0;
    color: ${({ theme }) => theme.text};
    font-weight: 600;
    font-size: 1rem;
  }
`;

const StatsGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.cardBackground || "#fff"};
  border: 1px solid ${({ theme }) => theme.bg3 || "#ddd"};
  color: ${({ theme }) => theme.text};
  border-radius: 8px;
  padding: 6px 10px;
  min-width: 120px;
  display: flex;
  flex-direction: column;
`;

const StatLabel = styled.span`
  font-size: 12px;
  opacity: 0.8;
`;

const StatValue = styled.span`
  font-size: 14px;
  font-weight: 600;
`;
