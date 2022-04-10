import React, {useState} from "react";
import './ProductImg.scss'

export default function ProductImg(props) {

    const images = props.images

    const [currentImgSrc, setCurrentImgSrc] = useState('')

    function handleClick(imgElement) {
        const activeImg = document.querySelector('.active')
        activeImg.className -= "active"
        imgElement.target.className = "active"
        setCurrentImgSrc(imgElement.target.src)
    }

    return (
        <div className="product-images-container">
            <div className="display-images-container">
                {images.map((img, index) => {
                    return <img 
                    key={index} 
                    className={index === 0 ? 'active' : ''} 
                    src={img} 
                    alt="" 
                    onClick={(img) => handleClick(img)}/>
                })}
            </div>
            <img src={currentImgSrc || images[0]} alt="" className='current-image' />
        </div>
    )
}