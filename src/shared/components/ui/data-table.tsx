import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Settings2,
} from "lucide-react";
import { useUpdateQueryParam } from "@/shared/hooks/useUpdateQueryParam";
import { cn } from "@/shared/lib/utils";
import { Button } from "./button";
import { DebouncedInput } from "./debounced-input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowClicked?: (id: number) => void;
  headConfig?: string;
  bodyRowsConfig?: string;
  pagesCount?: number;
  page?: number;
  limit?: number;
  loading?: boolean;
  tableId?: string;
  filters?: boolean;
  hideSearch?: boolean;
}

export function DataTable<TData, TValue>({
  headConfig,
  bodyRowsConfig,
  rowClicked,
  columns,
  data,
  pagesCount,
  page = 0, // Assuming page is 0-based by default from backend
  limit,
  loading,
  filters,
  tableId,
  hideSearch,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] = React.useState<
    Record<string, boolean>
  >({});
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: limit ? getPaginationRowModel() : undefined,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  React.useEffect(() => {
    if (!limit) return;
    table.setPageSize(limit);
  }, [limit]);

  React.useEffect(() => {
    if (page !== 0) return;
    table.setPageCount(1);
  }, [page]);

  const { updateQueryParam, getQueryParam } = useUpdateQueryParam(tableId);
  const defaultKeyword = getQueryParam("keyword");

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateQueryParam("keyword", e.target.value);
    updateQueryParam("page", "0");
  };

  return (
    <div className="w-full">
      <div className="rounded-lg w-full overflow-hidden ">
        {/* Header Section with Filters and Search */}
        {(filters || !hideSearch) && (
          <div className="bg-[#E6F4F2] px-2 py-2 border-b border-[var(--border)]">
            <div className="flex items-center justify-between  w-full gap-4">
              {filters ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs border-gray-300 rounded-sm bg-transparent shadow-none"
                  >
                    <Settings2 size={16} className="mr-1" />
                    Filters
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs border-gray-300 rounded-sm bg-transparent shadow-none"
                  >
                    <ArrowUpDown size={16} className="mr-1" />
                    Sorting
                  </Button>
                </div>
              ) : (
                <div />
              )}
              {!hideSearch && (
                <div className="relative ">
                  <Search
                    size={16}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <DebouncedInput
                    defaultValue={defaultKeyword}
                    onChange={onSearchChange}
                    placeholder="Search"
                    className="h-8 pl-8 pr-3 w-[200px] bg-transparent rounded-sm text-sm border-gray-300 "
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 ">
            {/* <Logo size='md' variant='pulse' /> */}
            <p className="mt-2 text-2xl">Loading</p>
          </div>
        ) : (
          <Table className="border-none">
            <TableHeader className="h-12 bg-white border-none">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={`${headerGroup.id}${tableId}`}
                  className={headConfig}
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={`${header.id}${tableId}`}
                        className="text-gray-500 text-xs border-t-none font-medium px-6 py-0 border-b border-r border-[#E9ECEF] last:border-r-0"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    className={cn(
                      bodyRowsConfig || "",
                      index % 2 === 0 ? "bg-white" : "bg-[#F8F9FA]",
                      "border-b border-[#E9ECEF]"
                    )}
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={`${cell.id}${tableId}`}
                        id={`${cell.id}${tableId}`}
                        onClick={() => {
                          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                          rowClicked && cell.column.getIndex() === 0
                            ? rowClicked!(
                                (row.original as any)?.id || row.getValue("id")
                              )
                            : null;
                        }}
                        className={cn(
                          "text-gray-800 px-6 py-2 text-sm font-normal border-r border-[#E9ECEF] last:border-r-0",
                          rowClicked && cell.column.getIndex() === 0
                            ? "hover:underline cursor-pointer text-[var(--primary)]"
                            : ""
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-gray-500"
                  >
                    No data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
      {limit && pagesCount ? (
        <div className="px-4 py-2 border-t border-[#E9ECEF] rounded-b-lg">
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8 p-0", {
                  "pointer-events-none opacity-50": page === 0,
                })}
                onClick={() => {
                  if (page === 0) return;
                  updateQueryParam("page", (Number(page) - 1).toString());
                }}
              >
                <ChevronLeft size={16} />
              </Button>

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, pagesCount || 0) }, (_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === page + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={isActive ? "default" : "ghost"}
                    size="icon"
                    className={cn(
                      "h-8 w-8 p-0 text-sm",
                      isActive && "bg-gray-200 text-gray-900"
                    )}
                    onClick={() => {
                      updateQueryParam("page", (pageNum - 1).toString());
                    }}
                  >
                    {pageNum}
                  </Button>
                );
              })}

              <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8 p-0", {
                  "pointer-events-none opacity-50":
                    page === Number(pagesCount) - 1,
                })}
                onClick={() => {
                  if (page === Number(pagesCount) - 1) return;
                  updateQueryParam("page", (Number(page) + 1).toString());
                }}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
