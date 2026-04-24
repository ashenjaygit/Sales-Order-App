import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClients, fetchItems } from '../redux/slices/referenceDataSlice';
import { createOrder, updateOrder, fetchOrderById, clearCurrentOrder } from '../redux/slices/salesOrderSlice';
import { useParams, useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';

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
    const [orderItems, setOrderItems] = useState([{ itemId: '', itemCode: '', description: '', note: '', quantity: 1, price: 0, taxRate: 0, exclAmount: 0, taxAmount: 0, inclAmount: 0 }]);

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

            if (currentOrder.salesOrderItems?.length > 0) {
                setOrderItems(currentOrder.salesOrderItems.map(oi => {
                    const matchedItem = items.find(i => i.id === oi.itemId) || { price: 0 };
                    return { ...oi, price: matchedItem.price };
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
                itemRow.price = selectedItem.price;
            } else {
                itemRow.itemId = ''; itemRow.price = 0;
            }
        } else {
            itemRow[field] = value;
        }

        const qty = Number(itemRow.quantity) || 0;
        const price = Number(itemRow.price) || 0;
        const taxRate = Number(itemRow.taxRate) || 0;

        itemRow.exclAmount = qty * price;
        itemRow.taxAmount = (itemRow.exclAmount * taxRate) / 100;
        itemRow.inclAmount = itemRow.exclAmount + itemRow.taxAmount;

        newItems[index] = itemRow;
        setOrderItems(newItems);
    };

    const totalExcl = orderItems.reduce((acc, row) => acc + (row.exclAmount || 0), 0);
    const totalTax = orderItems.reduce((acc, row) => acc + (row.taxAmount || 0), 0);
    const totalIncl = orderItems.reduce((acc, row) => acc + (row.inclAmount || 0), 0);

    const handleSave = async () => {
        const payload = {
            ...formData,
            id: isEditMode ? Number(id) : 0,
            totalExcl, totalTax, totalIncl,
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
        alert("Order Saved!");
    };

    return (
        <div className="bg-white border-2 border-gray-400 max-w-6xl mx-auto shadow-md">
            <div className="bg-gray-200 border-b-2 border-gray-400 p-2 flex justify-between items-center print:hidden">
                <div className="font-bold text-gray-800 ml-2 text-lg">Sales Order</div>
                <div className="flex space-x-2">
                    <button onClick={handleSave} className="bg-[#cbd5e1] border border-gray-500 hover:bg-gray-300 px-3 py-1 text-sm font-bold flex items-center space-x-1"><span className="text-xl leading-none">✔</span><span>Save Order</span></button>
                    <button onClick={() => navigate('/')} className="bg-[#cbd5e1] border border-gray-500 hover:bg-gray-300 px-3 py-1 text-sm font-bold flex items-center space-x-1"><span className="text-xl leading-none">✖</span><span>Close</span></button>
                    {isEditMode && <button onClick={() => window.print()} className="bg-[#cbd5e1] border border-gray-500 hover:bg-gray-300 px-3 py-1 text-sm font-bold">Print</button>}
                </div>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-8">
                    <div className="space-y-2">
                        <FormSelect 
                            label="Customer Name" 
                            value={formData.clientId} 
                            onChange={handleCustomerChange}
                            options={clients.map(c => ({ value: c.id, label: c.customerName }))}
                            className="bg-[#fde047]" // Highlighted dropdown based on Screen 1
                        />
                        <FormInput label="Address 1" value={customerAddress.add1} readOnly={true} />
                        <FormInput label="Address 2" value={customerAddress.add2} readOnly={true} />
                        <FormInput label="Address 3" value={customerAddress.add3} readOnly={true} />
                        <FormInput label="State" value={''} readOnly={true} />
                        <FormInput label="Post Code" value={''} readOnly={true} />
                    </div>

                    <div className="space-y-2">
                        <FormInput label="Invoice No." value={formData.invoiceNo} onChange={e => setFormData({...formData, invoiceNo: e.target.value})} />
                        <FormInput label="Invoice Date" type="date" value={formData.invoiceDate} onChange={e => setFormData({...formData, invoiceDate: e.target.value})} />
                        <FormInput label="Reference no" value={formData.referenceNo} onChange={e => setFormData({...formData, referenceNo: e.target.value})} />
                    </div>
                </div>

                <div className="overflow-x-auto mb-2 border border-gray-400">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-300 text-sm text-gray-800">
                                <th className="p-2 border border-gray-400 w-32 font-semibold">Item Code</th>
                                <th className="p-2 border border-gray-400 w-48 font-semibold">Description</th>
                                <th className="p-2 border border-gray-400 font-semibold">Note</th>
                                <th className="p-2 border border-gray-400 w-20 font-semibold">Quantity</th>
                                <th className="p-2 border border-gray-400 w-24 font-semibold">Price</th>
                                <th className="p-2 border border-gray-400 w-16 font-semibold">Tax</th>
                                <th className="p-2 border border-gray-400 w-28 font-semibold text-right">Excl Amount</th>
                                <th className="p-2 border border-gray-400 w-28 font-semibold text-right">Tax Amount</th>
                                <th className="p-2 border border-gray-400 w-28 font-semibold text-right">Incl Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems.map((row, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-400 p-0">
                                        <select className="w-full h-full p-2 bg-[#fde047] border-0" value={row.itemId} onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}>
                                            <option value=""></option>
                                            {items.map(i => <option key={i.id} value={i.id}>{i.itemCode}</option>)}
                                        </select>
                                    </td>
                                    <td className="border border-gray-400 p-0">
                                        <select className="w-full h-full p-2 bg-[#facc15] border-0" value={row.itemId} onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}>
                                            <option value=""></option>
                                            {items.map(i => <option key={i.id} value={i.id}>{i.description}</option>)}
                                        </select>
                                    </td>
                                    <td className="border border-gray-400 p-0"><input className="w-full p-2 border-0" value={row.note} onChange={e => handleItemChange(index, 'note', e.target.value)}/></td>
                                    <td className="border border-gray-400 p-0"><input type="number" className="w-full p-2 border-0 text-right" value={row.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)}/></td>
                                    <td className="border border-gray-400 p-2 text-right bg-gray-50 text-sm text-gray-600">{row.price.toFixed(2)}</td>
                                    <td className="border border-gray-400 p-0"><input type="number" className="w-full p-2 border-0 text-right" value={row.taxRate} onChange={e => handleItemChange(index, 'taxRate', e.target.value)}/></td>
                                    <td className="border border-gray-400 p-2 text-right bg-gray-100 text-sm">{row.exclAmount.toFixed(2)}</td>
                                    <td className="border border-gray-400 p-2 text-right bg-gray-100 text-sm">{row.taxAmount.toFixed(2)}</td>
                                    <td className="border border-gray-400 p-2 text-right bg-gray-100 text-sm">{row.inclAmount.toFixed(2)}</td>
                                </tr>
                            ))}
                            {/* Empty padding rows for grid aesthetics */}
                            {[...Array(4)].map((_, i) => (
                                <tr key={`empty-${i}`}>
                                    {[...Array(9)].map((_, j) => <td key={`empty-${i}-${j}`} className="border border-gray-400 p-4 bg-white"></td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-start print:hidden">
                    <button onClick={() => setOrderItems([...orderItems, { itemId: '', itemCode: '', description: '', note: '', quantity: 1, price: 0, taxRate: 0, exclAmount: 0, taxAmount: 0, inclAmount: 0 }])} className="bg-[#cbd5e1] border border-gray-500 text-sm font-semibold px-4 py-1 hover:bg-gray-300">
                        Add New Item
                    </button>
                </div>

                <div className="flex justify-end mt-4 pr-0">
                    <div className="w-72">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-bold text-gray-700">Total Excl</span>
                            <span className="border border-gray-400 p-1 w-32 text-right bg-white">{totalExcl.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-bold text-gray-700">Total Tax</span>
                            <span className="border border-gray-400 p-1 w-32 text-right bg-[#facc15] font-bold">{totalTax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-700">Total Incl</span>
                            <span className="border border-gray-400 p-1 w-32 text-right bg-white">{totalIncl.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesOrderScreen;
