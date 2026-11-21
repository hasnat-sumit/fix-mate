import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Column<T> = {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
  /** Hide the label in the mobile card (for the title or the actions row). */
  hideLabelOnMobile?: boolean;
};

type DataTableProps<T> = {
  caption: string;
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
};

/**
 * A table on medium screens and up; on phones each row becomes a card with labelled fields, so nothing
 * scrolls sideways. The first column is the card's heading.
 */
export function DataTable<T>({ caption, rows, columns, rowKey }: DataTableProps<T>) {
  const [first, ...rest] = columns;

  return (
    <>
      <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-border bg-card shadow-sm md:block">
        <table className="w-full min-w-[720px] text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              {columns.map((column) => (
                <th key={column.header} scope="col" className={cn("px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground", column.className)}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={rowKey(row)} className="align-middle transition-colors hover:bg-secondary/30">
                {columns.map((column) => (
                  <td key={column.header} className={cn("px-4 py-3.5 text-foreground/90", column.className)}>
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul aria-label={caption} className="mt-4 space-y-3 md:hidden">
        {rows.map((row) => (
          <li key={rowKey(row)} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            {first ? <div className="mb-3">{first.cell(row)}</div> : null}
            <dl className="space-y-2 text-sm">
              {rest.map((column) =>
                column.hideLabelOnMobile ? (
                  <div key={column.header} className="pt-1">
                    {column.cell(row)}
                  </div>
                ) : (
                  <div key={column.header} className="flex items-start justify-between gap-4">
                    <dt className="shrink-0 text-muted-foreground">{column.header}</dt>
                    <dd className="min-w-0 text-right text-foreground/90">{column.cell(row)}</dd>
                  </div>
                ),
              )}
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
