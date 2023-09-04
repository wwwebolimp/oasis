import { configureStore } from '@reduxjs/toolkit';
import {productApi} from "@/store/product/product.api";
import {orderApi} from "@/store/order/order.api";

const store = configureStore({
    reducer: {
        [productApi.reducerPath]: productApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        // Другие редюсеры, если есть
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(productApi.middleware).concat(orderApi.middleware)
});

export default store;
