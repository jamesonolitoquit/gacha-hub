'use client';

import { Fragment, useState, useMemo, ReactNode } from 'react';

type Column<T> = {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
  sortValue?: (item: T) => string | number;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  searchable?: boolean;
  searchPlaceholder?: string;
  getSearchText?: (item: T) => string;
  renderExpanded?: (item: T) => ReactNode;
  keyExtractor: (item: T, index: number) => string | number;
};

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  searchable = true,
  searchPlaceholder = 'Search...',
  getSearchText,
  renderExpanded,
  keyExtractor,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(new Set());

  const filtered = useMemo(() => {
    if (!search || !getSearchText) return data;
    const lower = search.toLowerCase();
    return data.filter((item) => getSearchText(item).toLowerCase().includes(lower));
  }, [search, data, getSearchText]);

  const sorted = useMemo(() => {
    if (!sortConfig) return filtered;
    return [...filtered].sort((a, b) => {
      const col = columns.find((c) => c.key === sortConfig.key);
      const aVal = col?.sortValue ? col.sortValue(a) : (a[sortConfig.key] ?? '');
      const bVal = col?.sortValue ? col.sortValue(b) : (b[sortConfig.key] ?? '');
      const cmp = typeof aVal === 'number' && typeof bVal === 'number'
        ? aVal - bVal
        : String(aVal).localeCompare(String(bVal));
      return sortConfig.direction === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortConfig, columns]);

  const toggleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const toggleExpand = (id: string | number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div>
      {searchable && getSearchText && (
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-white/30 outline-none transition focus:border-white/30 focus:bg-white/10"
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              {renderExpanded && <th className="w-10 px-4 py-3" />}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 font-medium text-white/60 ${col.sortable !== false ? 'cursor-pointer select-none hover:text-white/80' : ''}`}
                  onClick={() => col.sortable !== false && toggleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {sortConfig?.key === col.key && (
                      <span className="text-xs">{sortConfig.direction === 'asc' ? '\u25B2' : '\u25BC'}</span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (renderExpanded ? 1 : 0)}
                  className="px-4 py-12 text-center text-sm text-white/40"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              sorted.map((item, idx) => {
                const id = keyExtractor(item, idx);
                const isExpanded = expandedRows.has(id);
                return (
                  <Fragment key={id}>
                    <tr className="group border-b border-white/5 hover:bg-white/[0.02]">
                      {renderExpanded && (
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleExpand(id)}
                            className="flex h-5 w-5 items-center justify-center rounded text-xs text-white/40 transition hover:bg-white/10 hover:text-white/70"
                          >
                            {isExpanded ? '\u2212' : '+'}
                          </button>
                        </td>
                      )}
                      {columns.map((col) => (
                        <td key={col.key} className="px-4 py-3 text-white/80">
                          {col.render ? col.render(item) : String(item[col.key] ?? '')}
                        </td>
                      ))}
                    </tr>
                    {isExpanded && renderExpanded && (
                      <tr className="border-b border-white/5 bg-white/[0.02]">
                        <td colSpan={columns.length + 1} className="px-4 py-4">
                          <div className="relative">
                            <button
                              onClick={() => toggleExpand(id)}
                              className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded text-xs text-white/40 transition hover:bg-white/10 hover:text-white/70"
                            >
                              {'\u2715'}
                            </button>
                            {renderExpanded(item)}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-white/40">
        {sorted.length} / {data.length} records
      </p>
    </div>
  );
}
