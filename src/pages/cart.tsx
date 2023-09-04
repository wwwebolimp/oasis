import React, {useContext, useState} from 'react';
import {Layout, ProductCard} from "@/components";
import {CartContext} from "@/providers";
import {useSearchProductQuery} from "@/store/product/product.api";
import {IProduct} from "@/types/IProduct";
import Link from "next/link";
import Button from "@mui/material/Button";
import {Input, TextareaAutosize} from "@mui/base";
import {useCreateOrderMutation} from "@/store/order/order.api";
import {CartItem} from "@/types/IOrder";
import {router} from "next/client";
import {useRouter} from "next/router";

interface Props {
    // Введите свойства компонента здесь
}

type CustomError = {
    status: number;
    data: {
        success: boolean;
        errors: string[];
    };
};

export interface ISuccessResponse {
    data: IOrderResponse;
}

export interface IOrderResponse {
    success: boolean;
    name: string;
    phone: string;
    address: string;
    comment: string;
    cart: CartItem[];
    totalCost: number;
    orderId: string;
    version: number;
}

const Cart: React.FC<Props> = () => {
    const router = useRouter()
    const {cart, removeFromCart, addToCart, setCart} = useContext(CartContext)!;

    // Проверка на наличие элементов в корзине
    if (cart.length === 0) {
        return (
            <Layout>
                <div className={'container'}>
                    Корзина пуста
                </div>
            </Layout>
        );
    }

    // Извлеките id из объектов в корзине и объедините их в строку
    const cartProductIds = cart.map(item => item._id).join(',');

    // Вызовите запрос с полученной строкой id
    const {isLoading, isError, data: cartProducts} = useSearchProductQuery({ids: cartProductIds});

    const increaseQuantity = (productId: string) => {
        addToCart({_id: productId});
    };

    const decreaseQuantity = (productId: string) => {
        // Проверяем, есть ли продукт с этим id в корзине
        const productInCart = cart.find(item => item._id === productId);

        if (productInCart) {
            const currentQuantity = productInCart.quantity || 1;

            if (currentQuantity > 1) {
                // Уменьшаем количество только если оно больше 1
                const updatedQuantity = currentQuantity - 1;
                const updatedProduct = {...productInCart, quantity: updatedQuantity};
                const updatedCart = cart.map(item => (item._id === productId ? updatedProduct : item));
                setCart(updatedCart);
            }
        }
    };

    // Функция для вычисления общей суммы корзины с учетом скидки
    const calculateTotalPrice = (products: IProduct[] | IProduct | undefined) => {
        if (!products) {
            return 0; // Возвращаем 0, если products не существует
        }

        if (!Array.isArray(products)) {
            // Если products не является массивом, преобразуем его в массив
            products = [products];
        }

        const totalPrice = products.reduce((total, product) => {
            // Проверяем, есть ли продукт с этим id в корзине
            const productInCart = cart.find(item => item._id === product._id);
            if (productInCart) {
                const quantity = productInCart.quantity || 1;
                const discountedPrice = product.price - (product.price * (product.discount || 0) / 100);
                return total + (discountedPrice * quantity);
            }
            return total;
        }, 0);
        return totalPrice;
    };

    const totalCartPrice = calculateTotalPrice(cartProducts);

    const [customerName, setCustomerName] = useState<string>('');
    const [customerPhone, setCustomerPhone] = useState<string>('');
    const [customerAddress, setCustomerAddress] = useState<string>('');
    const [customerComment, setCustomerComment] = useState<string>('');

    const [createOrder, {
        data: createdOrderData,
        error: createOrderError,
        isLoading: isCreatingOrder
    }] = useCreateOrderMutation();
    const errorOrder = createOrderError as CustomError | undefined;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = await createOrder({
            name: customerName,
            phone: customerPhone,
            address: customerAddress,
            comment: customerComment,
            cart: cart
        }) as ISuccessResponse;
        if (result?.data && result?.data?.success) {
            console.log('Заказ успешно создан:', result.data);
            setCart([]);
            router.push({
                pathname: '/thanks',
                query: {
                    name: customerName,
                    phone: customerPhone,
                    address: customerAddress,
                    comment: customerComment,
                    totalCost: totalCartPrice
                }
            });
        }
    };

    return (
        <Layout>
            <div className={'container'}>
                {cartProducts && (
                    <div className={'flex flex-col gap-space-m'}>
                        <div className={''}>
                            <>
                                {Array.isArray(cartProducts) && cartProducts?.length > 0 && (
                                    <div className={'grid gap-space-s'}>
                                        <div className={'overflow-auto flex flex-col gap-space-s'}>
                                            {cartProducts?.map((product: IProduct) => (
                                                <div key={product._id}>
                                                    <div className={'flex items-center gap-space-s'}>
                                                        <Link href={`p/${product._id}`}
                                                              className={'flex items-center gap-space-s'}>
                                                            <h3 className="text-[22px] font-medium capitalize ">{product?.name}</h3>
                                                            <div className={'w-[120px]'}>
                                                                <img className={'aspect-[16/9] w-[100%] object-cover'}
                                                                     src={`${product.images[0]}`}
                                                                     loading={'lazy'}
                                                                     alt={`Изображение ${product.name}`}
                                                                />
                                                            </div>
                                                        </Link>
                                                        <div className={'flex flex-col gap-[5px]'}>
                                                            <div>
                                                                Количество: {cart.find(item => item._id === product._id)?.quantity || 1}
                                                            </div>
                                                            <div className={'flex gap-space-s'}>
                                                                <Button
                                                                    className={'bg-gray-300 hover:bg-gray-200 text-inherit min-w-0 h-[30px] w-[30px]'}
                                                                    onClick={() => increaseQuantity(product._id)}>+
                                                                </Button>
                                                                <Button
                                                                    className={'bg-gray-300 hover:bg-gray-200 text-inherit min-w-0 h-[30px] w-[30px]'}
                                                                    onClick={() => decreaseQuantity(product._id)}>-</Button>
                                                                <Button
                                                                    className={'bg-gray-300 hover:bg-gray-200 text-inherit min-w-0 h-[30px] px-[10px] '}
                                                                    onClick={() => removeFromCart(product._id)}>Удалить
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            Общая сумма с учетом скидки: {totalCartPrice} рублей
                                        </div>
                                    </div>
                                )}
                            </>
                        </div>
                        <form className={'grid gap-space-s'} onSubmit={handleSubmit}>
                            <label>
                <span className={'mb-[5px] block'}>
                  ФИО
                </span>
                                <input className={'baseInput'} onChange={(e) => setCustomerName(e.target.value)}/>
                            </label>
                            <label>
                <span className={'mb-[5px] block'}>
                  Номер телефона
                </span>
                                <input className={'baseInput'} onChange={(e) => setCustomerPhone(e.target.value)}
                                       type={'tel'}/>
                            </label>
                            <label>
                <span className={'mb-[5px] block'}>
                  Адрес
                </span>
                                <input className={'baseInput'} onChange={(e) => setCustomerAddress(e.target.value)}/>
                            </label>
                            <label>
                <span className={'mb-[5px] block'}>
                  Комментарий
                </span>
                                <TextareaAutosize className={'baseInput'}
                                                  onChange={(e) => setCustomerComment(e.target.value)}/>
                            </label>
                            <Button type={'submit'} className={'button-accent'}>Оформить заказ</Button>
                            {errorOrder && (
                                <div className="text-red-500">
                                    {errorOrder && <div>
                                        {errorOrder.data.errors[0]}
                                    </div>}
                                </div>
                            )}
                        </form>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Cart;
