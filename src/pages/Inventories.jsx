import { GiFlour } from "react-icons/gi";
import { FaBook, FaRecycle } from "react-icons/fa6";
import { HiPlus } from "react-icons/hi";
import {
  CustomTable,
  CustomContainer,
  RenderDescriptionCell,
  CustomButton,
} from "../components";
import data from "../inventories_data.json";
import PropTypes from "prop-types";

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
        <span>N/A</span>
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

function renderActionsCell({ row }, filterType) {
  if (filterType === "processed" || filterType === "returned") {
    return (
      <CustomButton
        icon={<HiPlus />}
        onClick={() => console.log("Agregar cantidad", row.original)}
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
export function Inventories({ title, filterType }) {
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
    {
      header: "Existencias",
      accessorKey: "stock",
    },
    {
      header: "Unidad",
      accessorKey: "measureId",
    },
    {
      header: "Costo promedio",
      accessorKey: "cost",
    },
    ...(filterType !== "raw"
      ? [
          {
            header: "Acciones",
            accessorKey: "actions",
            cell: ({ row }) => renderActionsCell({ row }, filterType),
          },
        ]
      : []),
  ];

  const iconsMap = {
    raw: <GiFlour />,
    processed: <FaBook />,
    returned: <FaRecycle />,
  };

  const datum = data.filter((item) => item.type === filterType);
  const icon = iconsMap[filterType];
  return (
    <CustomContainer>
      <h1>{title}</h1>
      <CustomTable
        data={datum}
        columns={columns}
        customButtons={
          <CustomButton
            icon={icon}
            onClick={() => console.log("Agregar Insumo o producto")}
          ></CustomButton>
        }
      />
    </CustomContainer>
  );
}

Inventories.propTypes = {
  title: PropTypes.string.isRequired,
  filterType: PropTypes.string.isRequired,
};
