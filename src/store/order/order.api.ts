import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IOrder } from "@/types/IOrder";

export const orderApi = createApi({
    reducerPath: 'order',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000/'
    }),
    endpoints: (build) => ({
        createOrder: build.mutation<IOrder, Partial<IOrder>>({ // IOrder should be replaced with your actual order type
            query: (order) => ({
                url: 'api/order',
                method: 'POST',
                body: order, // Pass the order data as the request body
            }),
        }),
    }),
});

export const { useCreateOrderMutation } = orderApi;
