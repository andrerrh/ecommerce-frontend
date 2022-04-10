import React, { useState, useEffect, useRef } from 'react'
import { useQuery } from '@apollo/client'

import './Purchases.scss'
import { PURCHASES } from '../../queries'
import showAlert from '../common/showAlert'

export default function Purchases() {

    const alertsRef = useRef()

    const [products, setProducts] = useState()

    const { loading, error, data } = useQuery(PURCHASES, {
        variables: {
            id: parseInt(localStorage.getItem('id'))
        }
    })

    useEffect(() => {
        if (error) return showAlert("Erro ao carregar dados", true, alertsRef)
        if (!loading && data) {
            setProducts(data.purchases)
        }
    }, [data, loading, error])

    return (
        <>
            <p
                ref={alertsRef}
                className='alerts'
            />
            <section className="purchases-page-container">
                <div className="main-content-container">
                    {
                        products && products.map((purchase) => {
                            return <div key={`product${purchase.id}`} className="product">
                                <img src={purchase.image} alt='product-img' className="product-image" />
                                <div className="product-purchase-info-container">
                                    <p className="product-purchase-name">{purchase.product_name}</p>
                                    <p className="product-purchase-quantity">Quantidade: {purchase.quantity}</p>
                                    <p className="product-purchase-date">Comprado em: {purchase.purchase_date}</p>
                                    <p className="product-purchase-price_payed">Preço pago: R${(purchase.price_payed * purchase.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        })
                    }
                </div>
            </section>
        </>
    )
}