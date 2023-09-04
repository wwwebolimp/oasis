import React, {ReactNode, useState} from 'react';
import {Header} from "@/components/index";
import Cart from "@/components/Cart";

interface Props {
    children: ReactNode
    // Введите свойства компонента здесь
}

const Layout: React.FC<Props> = ({children}) => {

    return (
        <div className={'flex flex-col min-h-[100vh]'}>
            <Header/>
            <div className={'py-[25px] flex-grow'}>
            {children}
            </div>
        </div>
    );
};

export default Layout;