import './App.css';
import Product from './Product';

import { authenticate, createCart, getCart, pullProducts } from './API'

import { useQuery } from '@tanstack/react-query';

import API from './API'
import { useState } from 'react';

function App() {

  const [accessToken, setAccessToken] = useState(localStorage.getItem('access-token'))
  const [localCart, setLocalCart] = useState(JSON.parse(localStorage.getItem('cart')))

  useQuery({
    queryKey: ['access_token'],
    queryFn: authenticate,
    onSuccess: ({data}) => {
        localStorage.setItem("access-token", data.access_token)

        API.defaults.headers = {
          "Authorization": `Basic ${data.access_token}`,
        }

        window.location.reload(false)
    },
    refetchOnWindowFocus: false,
    enabled: !accessToken,
  })

  const products = useQuery({
    queryKey: ['products'],
    queryFn: pullProducts,
    refetchOnWindowFocus: false,
    enabled: !!accessToken,
  })

  const cart = useQuery({
    queryKey: ['cart'],
    queryFn: localCart ? getCart : createCart,
    onSuccess: (response) => {
      const cart = {
        id: response.id,
        version: response.version,
      }

      localStorage.setItem("cart", JSON.stringify(cart))

      setLocalCart(cart.id)
    },
    refetchOnWindowFocus: false,
    enabled: !!accessToken,
  })

  return (
    <div className="App">
      <header className="App-header">
        <h1>Commerce Tools POC</h1>
        {products.data && <h3>Products list</h3>}
        {products.data && products.data.map((product, index) => product.variants.map((variant) => <Product key={product.id + variant.id} product={product} variant={variant} />))}
        {cart.data && <h3>Cart</h3>}
        {cart.data && cart.data.lineItems.map(product => <Product cartItem key={product.id} product={product} variant={product.variant} />)}
      </header>
    </div>
  );
}

export default App;
