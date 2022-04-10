import React, { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'

import './Cart.scss'
import { CART, DELETE_CART, DELETE_ALL_CART, UPDATE_PURCHASES } from '../../queries'
import showAlert from '../common/showAlert'
import Button from '../common/Button'


export default function Cart() {
    const navigate = useNavigate()

    const localId = localStorage.getItem('id')
    if (localId === 'null') navigate('/login')

    const alertsRef = useRef()

    const [products, setProducts] = useState()
    const [quantity, setQuantity] = useState({})
    const [totalValue, setTotalValue] = useState(0)

    const { loading, error, data, refetch } = useQuery(CART, {
        variables: {
            id: localStorage.getItem('id')
        }
    })

    const [deleteCartMutate] = useMutation(DELETE_CART)
    const [deleteAllCartMutate] = useMutation(DELETE_ALL_CART)
    const [updatePurchasesMutate] = useMutation(UPDATE_PURCHASES)

    useEffect(() => {
        if (error) return showAlert("Erro ao adquirir dados", true, alertsRef)
        if (!loading && data) {
            setProducts(data.cart)
        }
    }, [loading, error, data])

    //Set cart total value
    useEffect(() => {
        if (products) {
            const values = products.map((cart) => {
                return cart.product.price * (quantity[cart.product.id] || 1)
            })
            if (values.length >= 1) {
                const totalValue = values.reduce((accum, value) => accum + value)
                setTotalValue(totalValue)
            }
        }

    }, [products, quantity])

    const setProductQuantity = (e, id) => {
        if (e.target.value >= 1 && e.target.value <= 10) setQuantity({ ...quantity, [id]: e.target.value })
        return
    }

    const deleteCart = (productId) => {
        const validation = window.confirm("Deseja remover este item do carrinho?")
        if (!validation) return

        deleteCartMutate({
            variables: {
                id: productId
            }
        }).then(res => {
            showAlert("Item removido", false, alertsRef)
            refetch()
        })
    }

    const deleteAllCart = (purchaseFinished) => {
        if(!purchaseFinished) {
            const validation = window.confirm("Deseja remover este item do carrinho?")
            if (!validation) return
        }

        deleteAllCartMutate({
            variables: {
                id: parseInt(localStorage.getItem('id'))
            }
        }).then(res => {
            if(!purchaseFinished) showAlert("Itens removidos", false, alertsRef)
            refetch()
            setTotalValue(0)
        }).catch(res => showAlert("Erro ao limpar carrinho", true, alertsRef))
    }

    const confirmPurchase = () => {
        const validation = window.confirm("Deseja finalizar a compra?")
        if (!validation) return


        products.forEach((cart) => {
            const today = new Date()
            console.log(cart)

            let dateString = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()} ${today.getHours()}:${today.getMinutes()}`

            updatePurchasesMutate({variables: {
                id_user: parseInt(localStorage.getItem('id')),
                id_product: cart.product.id,
                product_name: cart.product.name,
                purchase_date: dateString,
                quantity: quantity[cart.product.id] || 1,
                price_payed: cart.product.price,
                image: cart.product.image1
            }}).then(res => {
                showAlert("Compra finalizada", false, alertsRef)
                deleteAllCart(true)
            }).catch(res => {
                console.log(res)
                showAlert("Erro ao finalizar compra", true, alertsRef)
            })
        })
    }

    return (
        <>
            <p
                ref={alertsRef}
                className='alerts'
            />
            <section className="cart-page-container">
                <div className="main-container">
                    <div className="fragment">
                        <h1>Meu carrinho</h1>
                        <div className='products-list'>
                            {
                                products && products.map((cart) => {
                                    return <span key={`product${cart.id}`} className="product">
                                        <img src={cart.product.image1} className="product-img" alt="" />
                                        <span className='product-info'>
                                            <p className='product-name'>{cart.product.name}</p>
                                            <p className='product-price'>R${(cart.product.price).toFixed(2)}</p>
                                            <p className='product-brand'>{cart.product.brands.name}</p>
                                            <label htmlFor="quantity">Quantidade</label>
                                            <input
                                                className='product-quantity'
                                                name='quantity'
                                                id='quantity'
                                                type='number'
                                                min='1'
                                                max='10'
                                                value={quantity[cart.product.id] || 1}
                                                onChange={(e) => setProductQuantity(e, cart.product.id)}
                                            />
                                            <div className="product-delete-container">
                                                <button
                                                    className="product-delete"
                                                    onClick={() => deleteCart(cart.id)}>
                                                    <FontAwesomeIcon icon={solid('trash')} />
                                                </button>
                                            </div>
                                        </span>
                                    </span>
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="confirmations-container">
                    <div className="confirmations">
                        <Button
                            onclick={confirmPurchase}
                            action="Confirmar compra"
                        />
                        <Button
                            onclick={() => deleteAllCart(false)}
                            action="Limpar carrinho"
                        />
                        <span className='total-value-container '>
                            <p>Valor total:</p>
                            <p className='total-value'>R${totalValue.toFixed(2)}</p>
                        </span>
                    </div>
                </div>
            </section>
        </>
    )
}