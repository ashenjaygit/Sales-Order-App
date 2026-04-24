import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClients, fetchItems } from '../redux/slices/referenceDataSlice';
import { createOrder, updateOrder, fetchOrderById, clearCurrentOrder } from '../redux/slices/salesOrderSlice';
import { useParams, useNavigate } from 'react-router-dom';

const SalesOrderScreen = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { clients, items } = useSelector((state) => state.referenceData);
    const { currentOrder } = useSelector((state) => state.salesOrders);

    const [formData, setFormData] = useState({
        invoiceNo: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        referenceNo: '',
        clientId: ''
    });

    const [customerAddress, setCustomerAddress] = useState({ add1: '', add2: '', add3: '' });
    const [orderItems, setOrderItems] = useState([getEmptyItem()]);

    function getEmptyItem() {
        return { itemId: '', itemCode: '', description: '', note: '', quantity: 1, price: 0, taxRate: 0, exclAmount: 0, taxAmount: 0, inclAmount: 0 };
    }

    useEffect(() => {
        dispatch(fetchClients());
        dispatch(fetchItems());
        if (isEditMode) {
            dispatch(fetchOrderById(id));
        } else {
            dispatch(clearCurrentOrder());
        }
    }, [dispatch, id, isEditMode]);

    useEffect(() => {
        if (isEditMode && currentOrder) {
            setFormData({
                invoiceNo: currentOrder.invoiceNo || '',
                invoiceDate: currentOrder.invoiceDate ? currentOrder.invoiceDate.split('T')[0] : '',
                referenceNo: currentOrder.referenceNo || '',
                clientId: currentOrder.clientId || ''
            });

            if (currentOrder.clientId && clients.length > 0) {
                const client = clients.find(c => c.id === currentOrder.clientId);
                if (client) {
                    setCustomerAddress({ add1: client.address1 || '', add2: client.address2 || '', add3: client.address3 || '' });
                }
            }

            if (currentOrder.salesOrderItems && currentOrder.salesOrderItems.length > 0) {
                setOrderItems(currentOrder.salesOrderItems.map(oi => {
                    const matchedItem = items.find(i => i.id === oi.itemId) || { price: 0 };
                    return { ...oi, price: matchedItem.price }; // populate price for UI calculations
                }));
            }
        }
    }, [currentOrder, isEditMode, clients, items]);

    const handleCustomerChange = (e) => {
        const selectedId = Number(e.target.value);
        setFormData({ ...formData, clientId: selectedId });
        
        const client = clients.find(c => c.id === selectedId);
        if (client) {
            setCustomerAddress({ add1: client.address1 || '', add2: client.address2 || '', add3: client.address3 || '' });
        } else {
            setCustomerAddress({ add1: '', add2: '', add3: '' });
        }
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...orderItems];
        let itemRow = { ...newItems[index] };

        if (field === 'itemId') {
            const selectedItem = items.find(i => i.id === Number(value));
            if (selectedItem) {
                itemRow.itemId = selectedItem.id;
                itemRow.itemCode = selectedItem.itemCode;
                itemRow.description = selectedItem.description;
                itemRow.price = selectedItem.price;
            } else {
                itemRow.itemId = ''; itemRow.itemCode = ''; itemRow.description = ''; itemRow.price = 0;
            }
        } else {
            itemRow[field] = value;
        }

        // Calculations
        const qty = Number(itemRow.quantity) || 0;
        const price = Number(itemRow.price) || 0;
        const taxRate = Number(itemRow.taxRate) || 0;

        itemRow.exclAmount = qty * price;
        itemRow.taxAmount = (itemRow.exclAmount * taxRate) / 100;
        itemRow.inclAmount = itemRow.exclAmount + itemRow.taxAmount;

        newItems[index] = itemRow;
        setOrderItems(newItems);
    };

    const addRow = () => {
        setOrderItems([...orderItems, getEmptyItem()]);
    };

    // Grand Totals
    const totalExcl = orderItems.reduce((acc, row) => acc + (row.exclAmount || 0), 0);
    const totalTax = orderItems.reduce((acc, row) => acc + (row.taxAmount || 0), 0);
    const totalIncl = orderItems.reduce((acc, row) => acc + (row.inclAmount || 0), 0);

    const handleSave = async () => {
        const payload = {
            ...formData,
            id: isEditMode ? Number(id) : 0,
            totalExcl,
            totalTax,
            totalIncl,
            salesOrderItems: orderItems.filter(i => i.itemId).map(i => ({
                id: i.id || 0,
                itemId: i.itemId,
                note: i.note,
                quantity: i.quantity,
                taxRate: i.taxRate,
                exclAmount: i.exclAmount,
                taxAmount: i.taxAmount,
                inclAmount: i.inclAmount
            }))
        };

        if (isEditMode) {
            await dispatch(updateOrder({ id, order: payload }));
        } else {
            const result = await dispatch(createOrder(payload)).unwrap();
            navigate(`/order/${result.id}`, { replace: true });
        }
        alert("Order Saved Successfully!");
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden max-w-6xl mx-auto">
            <div className="bg-gray-100 p-2 border-b border-gray-300 flex space-x-2 print:hidden">
                <button onClick={handleSave} className="flex items-center space-x-1 px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium">
                   <span>Save Order</span>
                </button>
                <button onClick={() => navigate('/')} className="flex items-center space-x-1 px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium">
                   <span>Back</span>
                </button>
                {isEditMode && (
                    <button onClick={handlePrint} className="flex items-center space-x-1 px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium">
                       <span>Print</span>
                    </button>
                )}
            </div>

            <div className="p-6">
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <label className="w-32 text-sm font-semibold">Customer Name</label>
                            <select 
                                className="flex-1 border p-1 border-gray-300 bg-white"
                                value={formData.clientId}
                                onChange={handleCustomerChange}
                            >
                                <option value="">Select Customer</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.customerName}</option>)}
                            </select>
                        </div>
                        <div className="flex items-center">
                            <label className="w-32 text-sm">Address 1</label>
                            <input className="flex-1 border p-1 border-gray-300 bg-gray-50" readOnly value={customerAddress.add1} />
                        </div>
                        <div className="flex items-center">
                            <label className="w-32 text-sm">Address 2</label>
                            <input className="flex-1 border p-1 border-gray-300 bg-gray-50" readOnly value={customerAddress.add2} />
                        </div>
                        <div className="flex items-center">
                            <label className="w-32 text-sm">Address 3</label>
                            <input className="flex-1 border p-1 border-gray-300 bg-gray-50" readOnly value={customerAddress.add3} />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center">
                            <label className="w-32 text-sm">Invoice No.</label>
                            <input className="flex-1 border p-1 border-gray-300" value={formData.invoiceNo} onChange={e => setFormData({...formData, invoiceNo: e.target.value})} />
                        </div>
                        <div className="flex items-center">
                            <label className="w-32 text-sm">Invoice Date</label>
                            <input type="date" className="flex-1 border p-1 border-gray-300" value={formData.invoiceDate} onChange={e => setFormData({...formData, invoiceDate: e.target.value})} />
                        </div>
                        <div className="flex items-center">
                            <label className="w-32 text-sm">Reference no</label>
                            <input className="flex-1 border p-1 border-gray-300" value={formData.referenceNo} onChange={e => setFormData({...formData, referenceNo: e.target.value})} />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto mb-4">
                    <table className="w-full text-left border-collapse border border-gray-400">
                        <thead>
                            <tr className="bg-gray-300 text-sm">
                                <th className="p-2 border border-gray-400 w-32">Item Code</th>
                                <th className="p-2 border border-gray-400 w-48">Description</th>
                                <th className="p-2 border border-gray-400">Note</th>
                                <th className="p-2 border border-gray-400 w-20">Quantity</th>
                                <th className="p-2 border border-gray-400 w-24">Price</th>
                                <th className="p-2 border border-gray-400 w-20">Tax %</th>
                                <th className="p-2 border border-gray-400 w-28">Excl Amount</th>
                                <th className="p-2 border border-gray-400 w-28">Tax Amount</th>
                                <th className="p-2 border border-gray-400 w-28">Incl Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems.map((row, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-400 p-0">
                                        <select className="w-full p-1 bg-white" value={row.itemId} onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}>
                                            <option value=""></option>
                                            {items.map(i => <option key={i.id} value={i.id}>{i.itemCode}</option>)}
                                        </select>
                                    </td>
                                    <td className="border border-gray-400 p-0">
                                        <select className="w-full p-1 bg-white" value={row.itemId} onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}>
                                            <option value=""></option>
                                            {items.map(i => <option key={i.id} value={i.id}>{i.description}</option>)}
                                        </select>
                                    </td>
                                    <td className="border border-gray-400 p-0"><input className="w-full p-1 border-0" value={row.note} onChange={e => handleItemChange(index, 'note', e.target.value)}/></td>
                                    <td className="border border-gray-400 p-0"><input type="number" className="w-full p-1 border-0 text-right" value={row.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)}/></td>
                                    <td className="border border-gray-400 p-1 text-right bg-gray-50">{row.price?.toFixed(2)}</td>
                                    <td className="border border-gray-400 p-0"><input type="number" className="w-full p-1 border-0 text-right" value={row.taxRate} onChange={e => handleItemChange(index, 'taxRate', e.target.value)}/></td>
                                    <td className="border border-gray-400 p-1 text-right bg-gray-50">{row.exclAmount.toFixed(2)}</td>
                                    <td className="border border-gray-400 p-1 text-right bg-gray-50">{row.taxAmount.toFixed(2)}</td>
                                    <td className="border border-gray-400 p-1 text-right bg-gray-50">{row.inclAmount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="flex justify-between items-start print:hidden mb-4">
                    <button onClick={addRow} className="text-sm border border-gray-300 px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">
                        + Add Row
                    </button>
                </div>

                <div className="flex justify-end mt-6">
                    <div className="w-64 space-y-2">
                        <div className="flex justify-between items-center border-b border-gray-300 pb-1">
                            <span className="text-sm font-semibold text-gray-700">Total Excl</span>
                            <span className="border p-1 bg-gray-50 w-32 text-right">{totalExcl.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-300 pb-1">
                            <span className="text-sm font-semibold text-gray-700">Total Tax</span>
                            <span className="border p-1 bg-gray-50 w-32 text-right">{totalTax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-400 pb-1 font-bold">
                            <span className="text-sm text-gray-800">Total Incl</span>
                            <span className="border p-1 bg-gray-50 w-32 text-right">{totalIncl.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesOrderScreen;
