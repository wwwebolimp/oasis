import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IProduct } from "@/types/IProduct";

export const productApi = createApi({
    reducerPath: 'product',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000/'
    }),
    endpoints: build => ({
        searchProduct: build.query<IProduct | IProduct[], { id?: string, ids?:string}>({
            query: ({ id,ids, }) => ({
                url: `api/product`,
                params: {
                    id,
                    ids
                }
            }),
        }),
    })
});

export const {useSearchProductQuery} = productApi
