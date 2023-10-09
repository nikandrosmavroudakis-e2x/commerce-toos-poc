import { useState } from 'react';
import './Product.css';

import { useQuery } from '@tanstack/react-query';

import { addItemToCart, removeItemFromCart } from './API'

function Product({product, variant, cartItem}) {

    const [addProduct, setAddProduct] = useState(false)
    const [removeProduct, setRemoveProduct] = useState(false)

    useQuery({
        queryKey: ['cart'],
        queryFn: () => addItemToCart(JSON.parse(localStorage.getItem('cart')), product, variant),
        onSuccess: ({ version }) => {
            const cart = JSON.parse(localStorage.getItem('cart'))

            localStorage.setItem("cart", JSON.stringify({
                ...cart,
                version,
            }))

            setAddProduct(false)
        },
        refetchOnWindowFocus: false,
        enabled: addProduct,
    })

    useQuery({
        queryKey: ['cart'],
        queryFn: () => removeItemFromCart(JSON.parse(localStorage.getItem('cart')), product, variant),
        onSuccess: ({ version }) => {
            const cart = JSON.parse(localStorage.getItem('cart'))

            localStorage.setItem("cart", JSON.stringify({
                ...cart,
                version,
            }))

            setRemoveProduct(false)
        },
        refetchOnWindowFocus: false,
        enabled: removeProduct,
    })
    
    return (
        <div className="Product">
            {cartItem ? `${product.quantity} x ` : null}
            {`${product.name["en-US"]} ${variant?.id}`}
            {cartItem ? 
                <button onClick={() => setRemoveProduct(true)}>remove from cart</button> : 
                <button onClick={() => setAddProduct(true)}>add to cart</button>
            }
        </div>
    );
}

export default Product;
