import React, { useState } from 'react'

import './ButtonOpen.scss'



export default function ButtonOpen({ click }) {
    const [classes, setClasses] = useState('open-btn')

    const handleClick = () => {
        if (classes.includes('clicked')) {
            setClasses('open-btn')
        } else {
            setClasses('open-btn clicked')
        }
    }

    return (
        <button onClick={() => {
            handleClick()
            click()
        }}
            className={classes}>
            <div className="line-one"></div>
            <div className="line-two"></div>
            <div className="line-three"></div>
        </button>
    )
}