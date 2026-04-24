import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../redux/slices/salesOrderSlice';
import { useNavigate } from 'react-router-dom';
import DataGrid from '../components/DataGrid';

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { orders, status } = useSelector((state) => state.salesOrders);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const columns = [
        { header: "Invoice No", accessor: "invoiceNo" },
        { header: "Date", accessor: "invoiceDate", render: (row) => new Date(row.invoiceDate).toLocaleDateString() },
        { header: "Customer", accessor: "customerName" },
        { header: "Ref No", accessor: "referenceNo" },
        { header: "Total Excl", accessor: "totalExcl", render: (row) => row.totalExcl.toFixed(2) },
        { header: "Total Tax", accessor: "totalTax", render: (row) => row.totalTax.toFixed(2) },
        { header: "Total Incl", accessor: "totalIncl", render: (row) => row.totalIncl.toFixed(2) },
    ];

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 max-w-6xl mx-auto">
            <div className="bg-gray-100 p-4 flex justify-between items-center border-b border-gray-300">
                <h2 className="text-xl font-bold text-gray-800">Home</h2>
                <button 
                    onClick={() => navigate('/order')}
                    className="bg-[#facc15] hover:bg-[#eab308] text-black px-5 py-2 font-bold shadow-sm transition-colors"
                >
                    Add New
                </button>
            </div>
            
            <div className="p-4">
                {status === 'loading' ? (
                    <div className="text-center p-4">Loading...</div>
                ) : (
                    <DataGrid 
                        columns={columns} 
                        data={orders} 
                        onRowDoubleClick={(row) => navigate(`/order/${row.id}`)}
                    />
                )}
            </div>
        </div>
    );
};

export default Home;
