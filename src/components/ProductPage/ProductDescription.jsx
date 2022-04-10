import React from "react";
import './ProductDescription.scss'

export default function ProductDescription(props) {
    return (
        <div className="product-description">{props.description}</div>
    )
}