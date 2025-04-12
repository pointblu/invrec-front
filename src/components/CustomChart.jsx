/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  BarChart,
  LineChart,
  PieChart,
  Bar,
  Line,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Definición de PropTypes para elementos del gráfico
const chartElementPropTypes = {
  dataKey: PropTypes.string.isRequired,
  name: PropTypes.string,
  fill: PropTypes.string,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  radius: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number),
  ]),
};

export function CustomChart({
  type = "bar",
  data = [],
  width = "100%",
  height = 300,
  title,
  colors = ["#8dc2f0", "#00C49F", "#FFBB28", "#FF8042"],
  margin = { top: 20, right: 30, left: 20, bottom: 5 },
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  barProps = [],
  lineProps = [],
  xAxisDataKey = "name",
  className,
  responsive = true,
}) {
  const renderChartContent = () => {
    // Obtenemos los colores del tema desde styled-components
    const themeColors = {
      text: "#2d3748", // Valores por defecto
      grid: "#e2e8f0",
      gray300: "#bdbbb7",
      cardBackground: "#fff",
    };

    const axisStyle = {
      tick: { fill: themeColors.text },
      axisLine: { stroke: themeColors.gray300 },
      tickLine: { stroke: themeColors.gray300 },
    };

    const gridStyle = {
      stroke: themeColors.gray300,
      strokeDasharray: "3 3",
    };

    const tooltipStyle = {
      backgroundColor: themeColors.cardBackground,
      borderColor: themeColors.gray300,
      color: themeColors.text,
    };

    const legendStyle = {
      color: themeColors.text,
    };

    switch (type) {
      case "bar":
        return (
          <BarChart data={data} margin={margin}>
            {showGrid && <CartesianGrid {...gridStyle} />}
            <XAxis dataKey={xAxisDataKey} {...axisStyle} />
            <YAxis {...axisStyle} />
            {showTooltip && <Tooltip contentStyle={tooltipStyle} />}
            {showLegend && <Legend wrapperStyle={legendStyle} />}
            {barProps.map((props, index) => (
              <Bar
                key={`bar-${props.dataKey}-${index}`}
                dataKey={props.dataKey}
                fill={colors[index % colors.length]}
                {...props}
              />
            ))}
          </BarChart>
        );
      case "line":
        return (
          <LineChart data={data} margin={margin}>
            {showGrid && <CartesianGrid {...gridStyle} />}
            <XAxis dataKey={xAxisDataKey} {...axisStyle} />
            <YAxis {...axisStyle} />
            {showTooltip && <Tooltip contentStyle={tooltipStyle} />}
            {showLegend && <Legend wrapperStyle={legendStyle} />}
            {lineProps.map((props, index) => (
              <Line
                key={`line-${props.dataKey}-${index}`}
                dataKey={props.dataKey}
                stroke={colors[index % colors.length]}
                {...props}
              />
            ))}
          </LineChart>
        );
      case "pie":
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            {showTooltip && <Tooltip contentStyle={tooltipStyle} />}
            {showLegend && <Legend wrapperStyle={legendStyle} />}
          </PieChart>
        );
      default:
        return null;
    }
  };

  const chartContent = renderChartContent();

  return (
    <ChartContainer className={className} $width={width}>
      {title && <ChartTitle>{title}</ChartTitle>}
      {responsive ? (
        <ResponsiveContainer width={width} height={height}>
          {chartContent}
        </ResponsiveContainer>
      ) : (
        <div style={{ width, height }}>{chartContent}</div>
      )}
    </ChartContainer>
  );
}

// Estilos con acceso al theme
const ChartContainer = styled.div`
  background: ${({ theme }) => theme.cardBackground || "#fff"};
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  width: ${({ $width }) =>
    typeof $width === "number" ? `${$width}px` : $width};
`;

const ChartTitle = styled.h3`
  color: ${({ theme }) => theme.text || "#2d3748"};
  margin-bottom: 15px;
  font-size: 1.2rem;
  text-align: center;
`;

// Validación de PropTypes
CustomChart.propTypes = {
  type: PropTypes.oneOf(["bar", "line", "pie"]),
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
    })
  ),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  colors: PropTypes.arrayOf(PropTypes.string),
  margin: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    left: PropTypes.number,
    bottom: PropTypes.number,
  }),
  showLegend: PropTypes.bool,
  showGrid: PropTypes.bool,
  showTooltip: PropTypes.bool,
  barProps: PropTypes.arrayOf(PropTypes.shape(chartElementPropTypes)),
  lineProps: PropTypes.arrayOf(PropTypes.shape(chartElementPropTypes)),
  xAxisDataKey: PropTypes.string,
  className: PropTypes.string,
  responsive: PropTypes.bool,
};
