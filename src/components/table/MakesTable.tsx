"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  AlertCircle,
} from "lucide-react";
import { getAllMakes, queryKeys } from "@/lib/api/nhtsa";
import { useVehicleStore } from "@/lib/store/vehicleStore";
import { cn } from "@/lib/utils";
import type { VehicleMake } from "@/types";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";
import Spinner from "@/components/ui/Spinner";

const columnHelper = createColumnHelper<VehicleMake>();

const PAGE_SIZES = [10, 15, 25, 50];

export default function MakesTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });

  const { searchQuery, setSelectedMake } = useVehicleStore();

  const { data: makes, isLoading, isFetching, isError } = useQuery({
    queryKey: queryKeys.allMakes,
    queryFn: getAllMakes,
  });
  const isStale = isError && makes !== undefined;
  const isBackgroundRefetch = isFetching && !isLoading;

  const columns = useMemo(
    () => [
      columnHelper.accessor("Make_ID", {
        header: "Make ID",
        cell: (info) => (
          <span className="font-display text-[10px] text-neon-cyan glow-cyan">
            #{info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("Make_Name", {
        header: "Make Name",
        cell: (info) => (
          <span className="text-sm text-text-primary">{info.getValue()}</span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Details",
        enableSorting: false,
        cell: (info) => (
          <Badge
            color="purple"
            onClick={() => {
              setSelectedMake(info.row.original);
            }}
            className="inline-flex items-center gap-1.5"
          >
            <Eye size={9} />
            View
          </Badge>
        ),
      }),
    ],
    [setSelectedMake]
  );

  const table = useReactTable({
    data: makes ?? [],
    columns,
    state: { sorting, globalFilter: searchQuery, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
  });

  const { pageIndex, pageSize } = table.getState().pagination;
  const totalFiltered = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();

  const paginationItems = Array.from({ length: pageCount }, (_, i) => i)
    .filter((i) => i === 0 || i === pageCount - 1 || Math.abs(i - pageIndex) <= 1)
    .reduce<(number | "…")[]>((acc, page, idx, arr) => {
      if (idx > 0 && (page as number) - (arr[idx - 1] as number) > 1) acc.push("…");
      acc.push(page);
      return acc;
    }, []);

  return (
    <div className="space-y-4">

      {/* Stale data warning */}
      {isStale && (
        <div className="flex items-center gap-2 px-3 py-2 rounded border border-neon-amber/30 bg-neon-amber/5">
          <AlertCircle size={12} className="text-neon-amber shrink-0" />
          <span className="text-[10px] text-neon-amber">Showing cached data — refresh failed</span>
        </div>
      )}

      {/* Table */}
      <div className="neon-card overflow-x-auto">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col style={{ width: "20%" }} />
            <col style={{ width: "60%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>

          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-neon-cyan/15 bg-neon-cyan/5">
                {hg.headers.map((header) => {
                  const sorted = header.column.getIsSorted();
                  const canSort = header.column.getCanSort();
                  return (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className={cn(
                        "px-4 py-3 text-left font-normal",
                        header.column.id === "actions" && "text-right",
                        canSort && "cursor-pointer select-none"
                      )}
                    >
                      <span className={cn(
                        "inline-flex items-center gap-1.5 font-display text-[9px] tracking-[0.18em] text-neon-cyan uppercase",
                        canSort && "hover:opacity-75 transition-opacity"
                      )}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {canSort && (
                          <span className="text-neon-cyan/50">
                            {sorted === "asc" ? (
                              <ChevronUp size={10} />
                            ) : sorted === "desc" ? (
                              <ChevronDown size={10} />
                            ) : (
                              <ChevronsUpDown size={10} />
                            )}
                          </span>
                        )}
                      </span>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="py-16 text-center">
                  <Spinner label="Loading makes..." />
                </td>
              </tr>
            ) : isError && !isStale ? (
              <tr>
                <td colSpan={3} className="py-16 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <AlertCircle size={16} className="text-neon-pink" />
                    <span className="text-xs text-neon-pink">Failed to load data</span>
                  </div>
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-16 text-center text-xs text-text-muted">
                  No makes match your search.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  onClick={() => setSelectedMake(row.original)}
                  className={cn(
                    "border-b border-neon-cyan/8 last:border-0 cursor-pointer transition-colors hover:bg-neon-cyan/4",
                    i % 2 === 1 && "bg-surface-2/30"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={cn(
                        "px-4 py-3 overflow-hidden",
                        cell.column.id === "actions" && "text-right"
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer: count + page size + pagination */}
      {!isLoading && !isError && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            {isBackgroundRefetch && (
              <span className="text-[9px] text-neon-cyan animate-pulse">Refreshing...</span>
            )}
            <span className="text-[10px] text-text-muted">
              {totalFiltered > 0 ? (
                <>
                  Showing{" "}
                  <span className="text-neon-cyan">
                    {pageIndex * pageSize + 1}–{Math.min((pageIndex + 1) * pageSize, totalFiltered)}
                  </span>
                  {" "}of{" "}
                  <span className="text-neon-cyan">{totalFiltered.toLocaleString()}</span>
                  {" "}makes
                </>
              ) : (
                <span className="text-neon-amber">No results</span>
              )}
            </span>

            <Select
              value={pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size} / page
                </option>
              ))}
            </Select>
          </div>

          {totalFiltered > 0 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-1.5 rounded border border-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={13} />
              </button>

              {paginationItems.map((item, idx) =>
                item === "…" ? (
                  <span key={`ellipsis-${idx}`} className="px-1 text-[10px] text-text-muted">
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => table.setPageIndex(item as number)}
                    className={cn(
                      "min-w-7 h-7 px-1.5 rounded border text-[10px] font-display tracking-wide transition-colors",
                      item === pageIndex
                        ? "border-neon-cyan text-neon-cyan bg-neon-cyan/10 glow-cyan"
                        : "border-neon-cyan/20 text-text-secondary hover:text-neon-cyan hover:border-neon-cyan/40"
                    )}
                  >
                    {(item as number) + 1}
                  </button>
                )
              )}

              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-1.5 rounded border border-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
