import React, {useContext} from "react";
import {Layout} from "@/components";
import {useSearchProductQuery} from "@/store/product/product.api";
import {IProduct} from "@/types/IProduct";
import {ProductCard} from "@/components";

export default function Home() {
    const {isLoading, isError, data: products} = useSearchProductQuery({});
    return (
        <div>
            <Layout>
                <div className="container">
                    {isError && <p>Что-то пошло не так</p>}
                    {isLoading && <p>Загрузка товаров</p>}
                    {products && (
                        <div className={'grid grid-cols-2 gap-[15px] xl:grid-cols-3'}>
                            <>
                                {Array.isArray(products) && products?.length > 0 ? (
                                    products?.map((product: IProduct) => (
                                        <ProductCard {...product} key={product._id}/>
                                    ))
                                ) : (
                                    <p>Товары не найдены</p>
                                )}
                            </>
                        </div>
                    )}
                </div>

                {/* /.container */}

            </Layout>
        </div>
    );
}
