import React from "react";
import './ProductCardRating.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

export default function ProductCardRating(props) {

    let stars = []
    let starRate = 0
    let i = 0
    if (props.productRating) {
        starRate = parseInt(props.productRating.rate) || 0
        for (i = 0; i < starRate; i++) {
            stars.push(<FontAwesomeIcon key={i} icon={solid('star')} className='rating-star' />)
        }
        if (starRate - starRate >= 0.5) stars.push(<FontAwesomeIcon key={i + 1}icon={solid('star-half-stroke')} className='rating-star'/>)
    }

    return (
        <>
            <span className="rating-container">
                {stars.map(star => star)}
                <p className='rating-value'>{starRate.toFixed(2)} / 5</p>
            </span>
        </>
    )
}