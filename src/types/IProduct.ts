export interface IProduct {
    _id: string
    name: string
    price: number
    images: string[]
    __v: number
    description?: string
    discount?: number
}