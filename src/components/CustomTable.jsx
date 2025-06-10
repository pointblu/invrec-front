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

export function CustomTable({
  data,
  columns,
  customButtons,
  customFilters,
  onRowClick,
  pagination = null,
  onPageChange = () => {},
  filtering,
  onFilteringChange,
}) {
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, globalFilter: filtering },
    onSortingChange: setSorting,
    onGlobalFilterChange: onFilteringChange,
    ...(!pagination && {
      getPaginationRowModel: getPaginationRowModel(),
      initialState: { pagination: { pageSize: 10 } },
    }),
    manualPagination: !!pagination,
    pageCount: pagination
      ? pagination.totalPages ??
        Math.ceil(pagination.totalItems / pagination.pageSize)
      : undefined,
  });

  const handlePageChange = (pageIndex) => {
    if (pagination) {
      onPageChange(pageIndex + 1);
    } else {
      table.setPageIndex(pageIndex);
    }
  };

  const currentPageIndex = pagination
    ? pagination.page - 1
    : table.getState().pagination.pageIndex;
  const pageCount = pagination
    ? pagination.totalPages ??
      Math.ceil(pagination.totalItems / pagination.pageSize)
    : table.getPageCount();

  return (
    <>
      <CustomSubContainer align="right">
        {customButtons && <ButtonGroup>{customButtons}</ButtonGroup>}
        {customFilters && <ButtonGroup>{customFilters}</ButtonGroup>}
        <CustomInput
          maxWidth="240px"
          type="text"
          id="filtro"
          label="Filtro"
          placeholder=" "
          icon={<AiOutlineSearch size={20} />}
          value={filtering}
          onChange={(e) => onFilteringChange(e.target.value)}
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
            <StyledTr
              key={row.id}
              onClick={() => onRowClick && onRowClick(row.original)}
            >
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
          onClick={() => handlePageChange(0)}
          disabled={currentPageIndex === 0}
        >
          <FaAngleDoubleLeft />
          <span></span>
        </PaginationButton>
        <PaginationButton
          onClick={() => handlePageChange(currentPageIndex - 1)}
          disabled={currentPageIndex === 0}
        >
          <FaAngleLeft />
          <span></span>
        </PaginationButton>

        <PageInputContainer>
          Página{" "}
          <PageInput
            type="number"
            value={currentPageIndex + 1}
            onChange={(e) => {
              let page = e.target.value ? Number(e.target.value) - 1 : 0;
              const maxPage = pageCount - 1;

              if (page > maxPage) page = maxPage;
              if (page < 0) page = 0;

              handlePageChange(page);
            }}
          />{" "}
          de {pageCount}
        </PageInputContainer>

        <PaginationButton
          onClick={() => handlePageChange(currentPageIndex + 1)}
          disabled={currentPageIndex >= pageCount - 1}
        >
          <FaAngleRight />
          <span></span>
        </PaginationButton>
        <PaginationButton
          onClick={() => handlePageChange(pageCount - 1)}
          disabled={currentPageIndex >= pageCount - 1}
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
  customFilters: PropTypes.node,
  onRowClick: PropTypes.func,
  pagination: PropTypes.shape({
    page: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    totalItems: PropTypes.number.isRequired,
    totalPages: PropTypes.number,
  }),
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  filtering: PropTypes.string,
  onFilteringChange: PropTypes.func,
};

// Componentes estilizados (mantenemos los mismos estilos)
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
    cursor: pointer;
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

const PageInputContainer = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0 10px;
  font-size: 14px;
`;

const PageInput = styled.input`
  width: 50px;
  padding: 5px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 5px;
  text-align: center;
  font-size: 14px;
  background-color: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
`;
