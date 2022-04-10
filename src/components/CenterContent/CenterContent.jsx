import React from "react";
import { Routes, Route } from 'react-router-dom'

import './CenterContent.scss'
import Account from "../Account/Account";
import Aside from '../Aside/Aside'
import Cart from "../Cart/Cart"
import Login from '../Login/Login'
import ProductGrid from '../ProductGrid/ProductGrid'
import ProductManagement from "../ProductManagement/ProductManagement";
import ProductPage from '../ProductPage/ProductPage'
import Purchases from '../Purchases/Purchases'

export default function CenterContent({ 
    setRatingFilter, 
    ratingFilter, 
    categoriesFilter, 
    setBrandsFilter, 
    brandsFilter, 
    setPriceOrder, 
    priceOrder,
    resetFilters
}) {

    return (
        <div className='center-content'>
            <Routes>
                <Route path='/' exact element={
                    <>
                        <Aside
                            setRatingFilter={setRatingFilter}
                            setBrandsFilter={setBrandsFilter}
                            brandsFilter={brandsFilter}
                            resetFilters={resetFilters}
                            setPriceOrder={setPriceOrder}
                        />
                        <ProductGrid
                            categoriesFilter={categoriesFilter}
                            ratingFilter={ratingFilter}
                            brandsFilter={brandsFilter}
                            priceOrder={priceOrder}
                        />
                    </>
                }
                />
                <Route path='/account' element={<Account />} />
                <Route path='/cart' element={<Cart />}/>
                <Route path='/login' element={<Login />}/>
                <Route path='/product' element={<ProductPage />} />
                <Route path='/productadm' element={<ProductManagement />} />
                <Route path='/purchases' element={<Purchases />} />
            </Routes>
        </div>
    )
}