import React, {useContext, useEffect} from 'react';
import {Layout} from '@/components';
import {useRouter} from 'next/router';
import {useSearchProductQuery} from '@/store/product/product.api';
import 'swiper/css';
import {IProduct} from '@/types/IProduct';
import {A11y, Navigation, Pagination} from 'swiper/modules';
import {Swiper, SwiperSlide, useSwiper} from 'swiper/react';
import {ArrowBack, ArrowForward} from "@mui/icons-material"; // Поправил путь к SlideNextButton
import {CartContext} from "@/providers";
import Button from "@mui/material/Button";

interface Props {
    // Введите свойства компонента здесь
}

const Product: React.FC<Props> = () => {
    const {cart, addToCart} = useContext(CartContext)!;

    const router = useRouter();
    const {id} = router.query as { id: string };
    const {isLoading, isError, data} = useSearchProductQuery({id: id});
    const product = data as IProduct;
    useEffect(() => {
        if (isError && !product) {
            router.replace('/product-not-found');
        }
    }, [isError, product]);

    if (isLoading) {
        return (
            <Layout>
                <p>Загрузка товара</p>
            </Layout>
        );
    }


    const isItemInCart = cart?.some((item) => item._id == id);

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        addToCart({_id: id});
    };

    return (
        <Layout>
            <div className="container md:grid grid-cols-2 md:gap-[20px]">

                {product?.images.length > 1 ? <div><Swiper
                        className={'relative mb-space-m md:mb-0'}
                        navigation={{
                            prevEl: '.productSliderPrev',
                            nextEl: '.productSliderNext'
                        }}

                        modules={[Navigation, Pagination, A11y]}
                        pagination={{clickable: true, el: '.productSliderPagination', type: 'progressbar'}}
                    >
                        {product?.images.map((image, index) => (
                            <SwiperSlide className={''} key={index}>
                                <img className={'w-[100%] aspect-[16/9] object-cover'} src={'/' + image}
                                     alt={`Image ${index}`}/>
                            </SwiperSlide>
                        ))}
                        <button
                            className={'absolute bg-white-700 !top-[50%] bottom-auto !translate-y-[-50%] z-10 disabled:opacity-20 productSliderPrev'}>
                            <ArrowBack className={'text-[35px] '}/>
                        </button>
                        <button
                            className={'absolute bg-white-700 !top-[50%] !right-0 !translate-y-[-50%] z-10 disabled:opacity-20 productSliderNext'}>
                            <ArrowForward className={'text-[35px]'}/>
                        </button>
                        <div
                            className={'productSliderPagination opacity-50 w-[100%] h-[5px] z-10  justify-center  flex flex-wrap gap-[5px] absolute !bottom-0 !right-0 !left-auto'}></div>
                    </Swiper></div> :
                    <img className={'w-[100%] mb-space-m md:mb-0 aspect-[16/9] object-cover'}
                         src={'/' + product.images[0]}
                         alt={`Image ${product?.name}`}/>}
                <div className={'md:flex md:flex-col md:justify-center'}>
                    <div className={'text-[25px] font-medium capitalize mb-[5px]'}>{product.name}</div>
                    <div className={'mb-space-s'}>{product?.description}</div>
                    <p className="mb-space-s !mt-auto"><span className={'  '}>Цена:</span> {product?.discount ?
                        <span>{<span className={'line-through text-gray-400'}>{product?.price}</span>} <span
                            className={'text-[20px] text-red-600 font-bold'}>{(product?.price - (product?.price * product?.discount) / 100)}</span> <span
                            className={'font-semibold text-red-600'}>₴</span></span> :
                        <span><span className={'text-[20px]  font-bold'}>{product?.price}</span> <span
                            className={'font-semibold'}>₴</span> </span>}
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
            </div>
        </Layout>
    );
};

export default Product;
