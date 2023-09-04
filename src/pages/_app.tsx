import '@/styles/globals.scss'
import 'typeface-montserrat';
import type {AppProps} from 'next/app'
import {SessionProvider} from "next-auth/react";
import React, {Provider} from "react-redux";
import store from "@/store";
import {CartProvider} from "@/providers";

interface CustomAppProps extends AppProps {
    session: any;
}

export default function App({Component, session, pageProps}: CustomAppProps) {
    return <Provider store={store}>
        <SessionProvider session={session}>
            <CartProvider>
                <Component {...pageProps} />
            </CartProvider>
        </SessionProvider>
    </Provider>


}
