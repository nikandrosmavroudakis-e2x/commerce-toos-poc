import axios from "axios";
import credentials from "./env_vars.json"

const { HOST, AUTH_URL, AUTH_TOKEN, PROJECT_KEY } = credentials

const axiosClient = axios.create()

axiosClient.defaults.baseURL = HOST
axiosClient.defaults.headers = {
    "Authorization": `Bearer ${localStorage.getItem('access-token')}`,
}
axiosClient.defaults.timeout = 2000
axiosClient.defaults.maxBodyLength = Infinity

function authenticate() {
    return axiosClient
        .post(`${AUTH_URL}/oauth/${PROJECT_KEY}/anonymous/token?grant_type=client_credentials`, {}, {
            headers: {
                "Authorization": `Basic ${AUTH_TOKEN}`,
            }
        })
}

function createCart() {
    return axiosClient
        .post(
            `${HOST}/${PROJECT_KEY}/me/carts`,
            {
                currency : "USD"
            }
        )
        .then((response) => response.data)
}

function getCart() {
    return axiosClient
        .get(`${HOST}/${PROJECT_KEY}/me/carts/${JSON.parse(localStorage.getItem('cart')).id}`)
        .then((response) => response.data)
}

function addItemToCart(cart, product, variant) {
    return updateCart("addLineItem", cart, {productId: product.id}, variant)
}

function removeItemFromCart(cart, product) {
    return updateCart("removeLineItem", cart, {lineItemId: product.id})
}

function updateCart(action, cart, product, variant) {
    let actions = {
        action,
        quantity: 1,
        ...product
    }

    if (variant) {
        actions = {
            ...actions,
            variantId: variant.id,
        }
    }
    return axiosClient
        .post(
            `${HOST}/${PROJECT_KEY}/me/carts/${cart.id}`,
            {
                version: cart.version,
                actions: [actions]
            }
        ).then(response => response.data)
}

function pullProducts() {
    return axiosClient
        .get(`${HOST}/${PROJECT_KEY}/product-projections`)
        .then((response) => response.data.results)
}
  
export default axiosClient

export {
    authenticate,
    createCart,
    getCart,
    addItemToCart,
    removeItemFromCart,
    pullProducts,
}