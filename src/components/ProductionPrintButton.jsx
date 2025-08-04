import { FaPrint } from "react-icons/fa";
import { downloadReport } from "../services/api";
import PropTypes from "prop-types";
import { CustomButton } from "./CustomButton";
import * as XLSX from "xlsx";
import { Tooltip } from "react-tooltip";

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const ProductionPrintButton = ({ bodyProduction }) => {
  const handlePrint = async () => {
    try {
      const today = getCurrentDate();
      const reportStartDate = bodyProduction?.startDate || today;
      const reportEndDate = bodyProduction?.endDate || today;

      const reportData = {
        startDate: reportStartDate,
        endDate: reportEndDate,
      };

      const response = await downloadReport(reportData);

      if (!response.success) {
        throw new Error(response.message || "Error al generar el reporte");
      }

      const base64Data = response?.data.split(",")[1] || response?.data;
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const workbook = XLSX.read(byteArray, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const htmlString = XLSX.utils.sheet_to_html(workbook.Sheets[sheetName]);

      // Header personalizado
      const customHeaderHtml = `
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0;">Orden de Producción</h1>
          <p style="margin: 0;">Desde: ${reportStartDate} — Hasta: ${reportEndDate}</p>
        </div>
      `;

      // HTML completo con encabezado + tabla
      const fullHtml = `
        <html>
          <head>
            <title>Orden de Producción</title>
            <style>
              body {
                font-family: sans-serif;
                padding: 40px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              }
              th, td {
                border: 1px solid #000;
                padding: 8px;
                text-align: left;
              }
              h1, p {
                font-weight: normal;
              }
            </style>
          </head>
          <body>
            ${customHeaderHtml}
            ${htmlString}
          </body>
        </html>
      `;

      const printWindow = window.open("", "", "width=900,height=600");
      if (!printWindow) {
        alert("No se pudo abrir la ventana de impresión");
        return;
      }

      printWindow.document.write(fullHtml);
      printWindow.document.close();
      printWindow.focus();

      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 1000);
    } catch (error) {
      console.error("Error al imprimir el reporte:", error);
      alert(`Error al imprimir: ${error.message}`);
    }
  };

  return (
    <>
      <Tooltip
        id="tooltip2-id"
        place="top"
        offset={30}
        style={{
          backgroundColor: "#9247FC",
          color: "#fff",
          padding: "6px 12px",
          borderRadius: "4px",
          fontSize: "0.9rem",
        }}
      />
      <CustomButton
        icon={
          <FaPrint
            data-tooltip-id="tooltip2-id"
            data-tooltip-content="Imprimir orden de producción"
          />
        }
        onClick={handlePrint}
        title="Imprimir orden de producción"
      />
    </>
  );
};

ProductionPrintButton.propTypes = {
  bodyProduction: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }),
};
