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

// =========================================================================
// FUNCIÓN PARA CAMBIO DE TEXTO DE UNIDADES (SIN CÁLCULO)
// =========================================================================
const convertUnitsInHtml = (htmlString) => {
  let newHtmlString = htmlString; // 1. Convertir 'grams' a 'Kg' // Busca un número (entero o decimal), un espacio, y la palabra 'grams' (ignora mayúsculas/minúsculas)

  newHtmlString = newHtmlString.replace(
    /(\d+\.?\d*)\s*grams/gi,
    (match, value) => {
      // Devuelve el valor numérico original seguido de ' Kg'
      return `${value} Kg`;
    }
  ); // 2. Convertir 'liters'/'liter' a 'ml' // Busca un número, un espacio, y la palabra 'liters' o 'liter'

  newHtmlString = newHtmlString.replace(
    /(\d+\.?\d*)\s*liters?/gi,
    (match, value) => {
      // Devuelve el valor numérico original seguido de ' ml'
      return `${value} ml`;
    }
  ); // 3. Convertir 'units'/'unit' a 'Un' // Busca un número, un espacio, y la palabra 'units' o 'unit'

  newHtmlString = newHtmlString.replace(
    /(\d+\.?\d*)\s*units?/gi,
    (match, value) => {
      // Devuelve el valor numérico original seguido de ' Un'
      return `${value} Un`;
    }
  );

  return newHtmlString;
};

// =========================================================================
// FUNCIÓN PARA EXTRAER Y TOTALIZAR INGREDIENTES
// =========================================================================
const extractAndTotalIngredients = (htmlString) => {
  // Objeto para almacenar la suma total: { 'ingrediente_unidadFinal': { name: '...', quantity: N, unit: '...' } }
  const totals = {}; // Regex para encontrar líneas de ingrediente. Captura: // 1: Nombre del Ingrediente // 2: Cantidad (número) // 3: Unidad original (grams, liters, units, o sus singulares)

  const ingredientRegex =
    /•\s*([^:]+):\s*(\d+\.?\d*)\s*(grams|liters|units|liter|unit)/gi;
  let match;

  while ((match = ingredientRegex.exec(htmlString)) !== null) {
    const ingredientName = match[1].trim();
    const quantity = parseFloat(match[2]);
    let originalUnit = match[3].toLowerCase(); // Determinar la unidad final de display

    let displayUnit;
    if (originalUnit.startsWith("gram")) {
      displayUnit = "Kg";
    } else if (originalUnit.startsWith("liter")) {
      displayUnit = "ml";
    } else if (originalUnit.startsWith("unit")) {
      displayUnit = "Un";
    } else {
      continue; // Saltar si la unidad no es reconocida
    } // Clave única para agregar: Nombre del ingrediente + Unidad final (para evitar sumar gramos con litros)

    const aggregationKey = `${ingredientName}_${displayUnit}`;

    if (!totals[aggregationKey]) {
      // Inicializar el total para este ingrediente/unidad
      totals[aggregationKey] = {
        name: ingredientName,
        quantity: 0,
        unit: displayUnit,
      };
    } // Sumar la cantidad numérica

    totals[aggregationKey].quantity += quantity;
  } // 💡 CORRECCIÓN: Dividir por 2 porque los datos vienen duplicados.

  return Object.values(totals).map((item) => ({
    ...item,
    quantity: item.quantity / 2,
  }));
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
      const sheetName = workbook.SheetNames[0]; // 1. Generar HTML de la hoja de cálculo (contiene el texto raw, ej. "0.63 grams")

      const htmlString = XLSX.utils.sheet_to_html(workbook.Sheets[sheetName]); // 2. Extraer y totalizar ingredientes (usando el htmlString original)

      const totalIngredients = extractAndTotalIngredients(htmlString); // 3. Generar el HTML de totales de ingredientes

      const totalIngredientsHtml = `
    <div style="margin-top: 40px; border-top: 2px solid #000; padding-top: 10px;">
     <h2 style="font-size: 1.2rem; margin-bottom: 10px; color: #333;">Ingredientes Totales</h2>
     <table style="width: 50%;">
      <thead>
       <tr style="background-color: #f2f2f2;">
        <th style="border: 1px solid #000; padding: 8px; text-align: left;">Ingrediente</th>
        <th style="border: 1px solid #000; padding: 8px; text-align: right;">Cantidad Total</th>
       </tr>
      </thead>
      <tbody>
       ${totalIngredients
         .map(
           (item) => `
        <tr>
         <td style="border: 1px solid #000; padding: 8px; text-align: left;">${
           item.name
         }</td>
         <td style="border: 1px solid #000; padding: 8px; text-align: right; font-weight: bold;">${item.quantity.toFixed(
           3
         )} ${item.unit}</td>
        </tr>
       `
         )
         .join("")}
      </tbody>
     </table>
    </div>
   `; // 4. Aplicar el cambio de texto de unidades al HTML generado para la tabla de producción

      const convertedHtmlString = convertUnitsInHtml(htmlString); // Header personalizado

      const customHeaderHtml = `
    <div style="text-align: center; margin-bottom: 30px;">
     <h1 style="margin: 0;">Orden de Producción</h1>
     <p style="margin: 0;">Desde: ${reportStartDate} — Hasta: ${reportEndDate}</p>
    </div>
   `; // HTML completo con encabezado + tabla de producción + tabla de totales

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
      ${convertedHtmlString} ${totalIngredientsHtml} </body>
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
      {" "}
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
      />{" "}
      <CustomButton
        icon={
          <FaPrint
            data-tooltip-id="tooltip2-id"
            data-tooltip-content="Imprimir orden de producción"
          />
        }
        onClick={handlePrint}
        title="Imprimir orden de producción"
      />{" "}
    </>
  );
};

ProductionPrintButton.propTypes = {
  bodyProduction: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }),
};
