import React, {useContext} from "react";
import {IProduct} from "@/types/IProduct";
import {CartContext} from "@/providers";
import {useRouter} from "next/router";
import Link from "next/link";
import Button from "@mui/material/Button";

interface Props extends IProduct {
    _id: string;
}

const ProductCard: React.FC<Props> = ({_id, name, price, description, discount, images}) => {
    const router = useRouter();
    const {cart, addToCart,removeFromCart} = useContext(CartContext)!;

    const isItemInCart = cart.some((item) => item._id === _id);

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // Предотвращаем стандартное действие кнопки
        addToCart({_id});
    };

    return (
        <Link className={'flex '} href={`/p/${_id}`} passHref>
            <div className={'flex flex-col w-[100%]'} key={_id}>
                <img className={'aspect-[16/9] object-cover'} src={images[0]} alt={`Изображение ${name}`} loading="lazy" key={_id}/>
                <h3 className="text-[25px] font-medium   capitalize mt-space-m mb-space-s">{name}</h3>
                <p className="mb-space-s !mt-auto"><span className={' '}>Цена:</span> {discount ?
                    <span>{<span className={'line-through text-gray-400'}>{price}</span>} <span
                        className={'text-[20px] text-red-600 font-bold'}>{(price - (price * discount) / 100)}</span> <span
                        className={'font-semibold text-red-600'}>₴</span></span> :
                    <span><span className={'text-[20px]  font-bold'}>{price}</span> <span className={'font-semibold'}>₴</span> </span>}
                </p>

                {typeof window !== "undefined" && isItemInCart ? (
                    <Button onClick={() => router.push('/cart')} className=" button-accent block text-accent"
                            type="button">
                        Перейти в корзину
                    </Button>
                ) : (
                    <Button onClick={handleAddToCart} className=" button-accent text-accent" type="button">
                        Добавить в корзину
                    </Button>
                )}


            </div>
        </Link>
    );
};

export default ProductCard;
