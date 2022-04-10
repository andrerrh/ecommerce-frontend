import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from '@apollo/client'

import './ProductPage.scss'
import ProductImg from "./ProductImg";
import ProductPurchaseInfo from "./ProductPurchaseInfo";
import ProductDescription from './ProductDescription'
import { FULL_PRODUCT } from "../../queries";

export default function ProductPage() {

    const location = useLocation()
    const { id } = location.state

    const [product, setProduct] = useState({})

    const { loading, data } = useQuery(FULL_PRODUCT, {variables: { id }})

    useEffect(() => {
        if (loading === false && data) {
            setProduct(data.product)
        }
    }, [loading, data])

    return (
        <div className='product-page'>
            <ProductImg images={[
                product.image1,
                product.image2,
                product.image3,
                product.image4,
                product.image5
            ]} />
            <ProductPurchaseInfo product={product} />
            <ProductDescription description={product.description} />
        </div>
    )
}