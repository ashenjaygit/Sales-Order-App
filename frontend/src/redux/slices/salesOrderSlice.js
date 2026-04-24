import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/apiService';

export const fetchOrders = createAsyncThunk('salesOrders/fetchOrders', async () => {
    const response = await api.get('/SalesOrders');
    return response.data;
});

export const fetchOrderById = createAsyncThunk('salesOrders/fetchOrderById', async (id) => {
    const response = await api.get(`/SalesOrders/${id}`);
    return response.data;
});

export const createOrder = createAsyncThunk('salesOrders/createOrder', async (order) => {
    const response = await api.post('/SalesOrders', order);
    return response.data;
});

export const updateOrder = createAsyncThunk('salesOrders/updateOrder', async ({ id, order }) => {
    const response = await api.put(`/SalesOrders/${id}`, order);
    return response.data;
});

const salesOrderSlice = createSlice({
    name: 'salesOrders',
    initialState: {
        orders: [],
        currentOrder: null,
        status: 'idle',
        error: null
    },
    reducers: {
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.orders = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.currentOrder = action.payload;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.orders.push(action.payload);
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                const index = state.orders.findIndex(o => o.id === action.payload.id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
            });
    }
});

export const { clearCurrentOrder } = salesOrderSlice.actions;
export default salesOrderSlice.reducer;
