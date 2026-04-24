import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../redux/slices/salesOrderSlice';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { orders, status } = useSelector((state) => state.salesOrders);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden max-w-6xl mx-auto">
            <div className="bg-gray-50 p-4 flex justify-between items-center border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-700">Home</h2>
                <button 
                    onClick={() => navigate('/order')}
                    className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                    Add New
                </button>
            </div>
            
            <div className="p-4 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-200 text-sm uppercase text-gray-600">
                            <th className="p-3 border border-gray-300">Invoice No</th>
                            <th className="p-3 border border-gray-300">Date</th>
                            <th className="p-3 border border-gray-300">Customer</th>
                            <th className="p-3 border border-gray-300">Ref No</th>
                            <th className="p-3 border border-gray-300">Total Excl</th>
                            <th className="p-3 border border-gray-300">Total Tax</th>
                            <th className="p-3 border border-gray-300">Total Incl</th>
                        </tr>
                    </thead>
                    <tbody>
                        {status === 'loading' && <tr><td colSpan="7" className="p-4 text-center">Loading...</td></tr>}
                        {orders.map((o) => (
                            <tr 
                                key={o.id} 
                                onDoubleClick={() => navigate(`/order/${o.id}`)}
                                className="hover:bg-blue-50 cursor-pointer border-b border-gray-200 transition-colors"
                            >
                                <td className="p-3 border-x border-gray-200 text-sm">{o.invoiceNo}</td>
                                <td className="p-3 border-x border-gray-200 text-sm">{new Date(o.invoiceDate).toLocaleDateString()}</td>
                                <td className="p-3 border-x border-gray-200 text-sm">{o.customerName}</td>
                                <td className="p-3 border-x border-gray-200 text-sm">{o.referenceNo}</td>
                                <td className="p-3 border-x border-gray-200 text-sm">{o.totalExcl.toFixed(2)}</td>
                                <td className="p-3 border-x border-gray-200 text-sm">{o.totalTax.toFixed(2)}</td>
                                <td className="p-3 border-x border-gray-200 text-sm">{o.totalIncl.toFixed(2)}</td>
                            </tr>
                        ))}
                        {orders.length === 0 && status !== 'loading' && (
                            <tr><td colSpan="7" className="p-4 text-center text-gray-500">No orders found. Double click a row to edit once added.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Home;
