function Table({ columns = [], rows = [], children }) {
  const normalizedColumns = columns.map((column) =>
    typeof column === 'string' ? { key: column, label: column } : column
  );

  return (
    <table className="table">
      <thead>
        <tr>
          {normalizedColumns.map((column) => (
            <th key={column.key}>{column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {children ||
          rows.map((row, index) => (
            <tr key={row.id || index}>
              {normalizedColumns.map((column) => (
                <td key={column.key}>{row[column.key]}</td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default Table;
