import React from 'react';

const DataGrid = ({ columns, data, onRowDoubleClick }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200 text-sm uppercase text-gray-700">
                        {columns.map((col, idx) => (
                            <th key={idx} className="p-3 border border-gray-300 font-semibold">{col.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="p-4 text-center text-gray-500 italic">
                                No data available.
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIdx) => (
                            <tr 
                                key={rowIdx} 
                                onDoubleClick={() => onRowDoubleClick && onRowDoubleClick(row)}
                                className={`border-b border-gray-200 transition-colors ${onRowDoubleClick ? 'cursor-pointer hover:bg-blue-50' : 'bg-white'}`}
                            >
                                {columns.map((col, colIdx) => (
                                    <td key={colIdx} className="p-3 border-x border-gray-300 text-sm text-gray-700">
                                        {col.render ? col.render(row) : row[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DataGrid;
