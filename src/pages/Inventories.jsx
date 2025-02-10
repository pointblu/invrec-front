import { GiFlour } from "react-icons/gi";
import { FaBook, FaRecycle } from "react-icons/fa6";
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
  getValue: PropTypes.func.isRequired, // getValue es una función que obtiene el valor de la celda
};
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
