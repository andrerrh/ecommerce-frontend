import React from "react";
import './ProductCard.scss'
import ProductCardRating from "./ProductCardRating";

export default function ProductCard(props) {

    return (
        <>
            <div
                className="product-card"
            >
                <img src={props.productImage} alt="Imagemdoproduto" className="product-img" />
                <div className="name-brand-rating-container">
                    <h2 className="product-name">{props.productName}</h2>
                    <div className="product-name-tooltip">{props.productName}</div>
                    <div className="product-brand">{props.productBrand}</div>
                    <div className="product-rating">
                    </div>
                    <ProductCardRating productRating={props.productRating} />
                </div>
                <div className="price-category-container">
                    <div className="product-price">R${(props.productPrice).toFixed(2)}</div>
                    <div className="product-category">{props.productCategory}</div>
                </div>
            </div>
        </>
    )
}