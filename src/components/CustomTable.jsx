import styled from "styled-components";
import { AiOutlineSearch } from "react-icons/ai";
import {
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
} from "react-icons/fa";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { CustomInput, CustomSubContainer } from "../components";
import PropTypes from "prop-types";

export function CustomTable({ data, columns, customButtons }) {
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, globalFilter: filtering },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  });
  return (
    <>
      <CustomSubContainer align="right">
        {customButtons && <ButtonGroup>{customButtons}</ButtonGroup>}
        <CustomInput
          maxWidth="240px"
          type="text"
          id="filtro"
          label="Filtro"
          placeholder=" "
          icon={<AiOutlineSearch size={20} />}
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
        />
      </CustomSubContainer>

      <StyledTable>
        <StyledThead>
          {table.getHeaderGroups().map((headerGroup) => (
            <StyledTr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <StyledTh
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{ asc: "▲", desc: "▼" }[header.column.getIsSorted() ?? null]}
                </StyledTh>
              ))}
            </StyledTr>
          ))}
        </StyledThead>
        <StyledTbody>
          {table.getRowModel().rows.map((row) => (
            <StyledTr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <StyledTd key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </StyledTd>
              ))}
            </StyledTr>
          ))}
        </StyledTbody>
        <StyledTfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <StyledTr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <StyledTh key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </StyledTh>
              ))}
            </StyledTr>
          ))}
        </StyledTfoot>
      </StyledTable>
      <CustomSubContainer align="right">
        <PaginationButton
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <FaAngleDoubleLeft />
          <span></span>
        </PaginationButton>
        <PaginationButton
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <FaAngleLeft />
          <span></span>
        </PaginationButton>

        <PaginationButton
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <FaAngleRight />
          <span></span>
        </PaginationButton>
        <PaginationButton
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <FaAngleDoubleRight />
          <span></span>
        </PaginationButton>
      </CustomSubContainer>
    </>
  );
}

CustomTable.propTypes = {
  data: PropTypes.any,
  columns: PropTypes.any,
  customButtons: PropTypes.node,
};

// Componentes estilizados
const StyledTable = styled.table`
  width: 97%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 1em;
  min-width: 400px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
`;

const StyledThead = styled.thead`
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.textsecondary};
  text-align: left;
`;

const StyledTbody = styled.tbody`
  tr {
    border-bottom: 1px solid ${({ theme }) => theme.primaryHover};
  }

  tr:nth-of-type(even) {
    background-color: ${({ theme }) => theme.bg3};
  }

  tr:last-of-type {
    border-bottom: 2px solid ${({ theme }) => theme.textprimary};
  }
`;

const StyledTfoot = styled.tfoot`
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.textsecondary};
  text-align: left;
`;

const StyledTr = styled.tr`
  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
  }
`;

const StyledTh = styled.th`
  padding: 12px 15px;
`;

const StyledTd = styled.td`
  padding: 12px 15px;
`;

const PaginationButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 5px;
  cursor: pointer;
  font-family: Arial, sans-serif;
  font-size: 14px;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.primary};
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    font-size: 16px;
  }
`;
const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-left: 15px;
`;
