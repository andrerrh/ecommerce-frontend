import React, { useRef } from "react";
import './Button.scss'

export default function Button(props) {

    //Button hover effect
    const btnRef = useRef(null)

    function onMouseEnter() {
        btnRef.current.style.backgroundPositionX = `${btnRef.current.offsetWidth}px`
    }

    function onMouseLeave() {
        btnRef.current.style.backgroundPositionX = 0
    }

    return (
        <button
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={(e) => props.onclick(e)}
            ref={btnRef}
            className={
                    props.action === "Cancelar" ||
                    props.action === "X" ||
                    props.action === "Limpar carrinho" ?
                    "default-btn red-btn" : "default-btn"}
        >
            {props.action}{props.icon}
        </button>
    )
}