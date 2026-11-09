export default function TableList({
  columns = [],
  rows = [],
  getRowKey = (row, index) => row?.id ?? index,
  loading = false,
  emptyMessage = "No se encontraron registros.",
  caption = "Listado de registros",
  className = "",
}) {
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label={caption}
      className={`w-full overflow-x-auto border border-slate-200 rounded-lg bg-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-upla-500 ${className}`}
    >
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-slate-50 text-slate-700 font-semibold">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="px-4 py-3.5 whitespace-nowrap text-xs uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody
          className="divide-y divide-slate-200 bg-white"
          aria-busy={loading ? "true" : undefined}
        >
          {loading ? (
            Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={`skeleton-${rowIndex}`} className="animate-pulse">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-4 whitespace-nowrap">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                  </td>
                ))}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-slate-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr
                key={getRowKey(row, rowIndex)}
                className="hover:bg-slate-50 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3.5 text-slate-700">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
