import React, { useRef } from "react";
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation } from '@apollo/client'
import { useNavigate } from "react-router-dom";

import './ProductPurchaseInfo.scss'
import ProductCardRating from "../ProductCard/ProductCardRating";
import Button from '../common/Button'
import { CART_UPDATE } from '../../queries'
import showAlert from '../common/showAlert'

export default function ProductPurchaseInfo(props) {

    const [addToCartMutate] = useMutation(CART_UPDATE)

    const navigate = useNavigate()

    const alertsRef = useRef()

    const productRating = {
        rate: props.product.positive_rating / props.product.total_rating * 5,
        total: props.product.total_rating
    }

    const addToCart = () => {
        const localId = localStorage.getItem('id')
        if (localId === 'null') navigate('/login')
        addToCartMutate({
            variables: {
                id_user: parseInt(localStorage.getItem('id')),
                id_product: parseInt(props.product.id)
            }
        }).then(res => {
            showAlert("Produto adicionado", false, alertsRef)
        }).catch(res => {
            console.log(res)
            showAlert("Ocorreu um erro", true, alertsRef)
        })
    }

    return (
        <>
            <p
                ref={alertsRef}
                className='alerts'
            />
            <div className="product-purchase-container">
                <div className="product-purchase-info">
                    <h2 className="product-info-name">{props.product.name}</h2>
                    <ProductCardRating productRating={productRating} />
                    <div className="product-price-container">
                        <p className="price-installment">10x de R${(props.product.price / 10).toFixed(2)} ou</p>
                        <p className="full-price">A vista por <b>R${parseInt((props.product.price)).toFixed(2)}</b></p>
                    </div>
                    <div className='buy-btn'>
                        <Button
                            onclick={addToCart}
                            action='Adicionar'
                            icon={<FontAwesomeIcon icon={solid('shopping-cart')} />}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}