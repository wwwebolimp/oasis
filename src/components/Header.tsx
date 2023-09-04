import React, {useContext, useEffect, useState} from 'react';
import Link from "next/link";
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import {useRouter} from "next/router";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {CartContext} from "@/providers";

interface Props {
    // Введите свойства компонента здесь
}

const Header: React.FC<Props> = () => {
    const router = useRouter()
    const [scrollY, setScrollY] = useState(0);
    // Обработчик прокрутки
    const handleScroll = () => {
        setScrollY(window.scrollY);
    };
    useEffect(() => {
        // Добавляем обработчик прокрутки при монтировании компонента
        window.addEventListener('scroll', handleScroll);

        // Удаляем обработчик прокрутки при размонтировании компонента
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    const {cart} = useContext(CartContext)!


    return (
        <header
            className={`z-10 transition-colors bg-white-900 sticky top-0 left-0  `}>
            <div className={'container h-header-height items-center max-w-none !px-0 flex '}>
                <Button onClick={() => router.push('/')}
                        className={'mr-auto !font-medium  !text-[30px] w-[50%] md:!w-[250px] capitalize !rounded-[0] !bg-accent h-[100%] !text-white flex items-center justify-center '}>
                    oasis
                </Button>
                <Button
                    className={'relative w-header-height h-[100%] flex justify-center items-center !rounded-[0] !text-inherit '}>
                    <ShoppingCartIcon className={'!w-[50px] !h-[50px]'}/>
                    <div className={'text-[15px] absolute top-[7px] right-[7px] leading-[0] w-[23px] h-[23px] border-2 border-black flex justify-center items-center  bg-white  rounded-[50%] font-semibold uppercase'}>
                        {cart?.length}
                    </div>
                </Button>
                <Button
                    className={'w-header-height h-[100%] flex justify-center items-center !rounded-[0] !text-inherit '}>
                    <MenuIcon className={'!w-[50px] !h-[50px]'}/>
                </Button>
            </div>
        </header>
    );
};

export default Header;