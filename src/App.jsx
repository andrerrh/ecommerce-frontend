import React, { useState } from "react";
import { BrowserRouter } from 'react-router-dom'
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache
} from "@apollo/client"

import './index.css'
import Header from './components/Navs/Header'
import Navbar from './components/Navs/Navbar'
import Footer from './components/Footer/Footer'
import CenterContent from './components/CenterContent/CenterContent'

const client = new ApolloClient({
    uri: 'https://andrerh-ecommerce-backend.herokuapp.com/graphql',
    cache: new InMemoryCache()
})

export default function App() {
    const [categoriesFilter, setCategoriesFilter] = useState(0)
    const [brandsFilter, setBrandsFilter] = useState([])
    const [priceOrder, setPriceOrder] = useState('')
    const [ratingFilter, setRatingFilter] = useState(0)

    const resetFilters = () => {
        setRatingFilter(0)
        setCategoriesFilter(0)
        setBrandsFilter([])
    }

    return (
        <BrowserRouter >
            <ApolloProvider client={client}>
                <React.StrictMode>
                    <Navbar
                        resetFilters={resetFilters}
                        setPriceOrder={setPriceOrder}
                        setCategoriesFilter={setCategoriesFilter}
                        setBrandsFilter={setBrandsFilter}
                    />
                    <Header
                        setCategoriesFilter={setCategoriesFilter}
                        setBrandsFilter={setBrandsFilter}
                    />
                    <CenterContent
                        resetFilters={resetFilters}
                        setRatingFilter={setRatingFilter}
                        setPriceOrder={setPriceOrder}
                        setCategoriesFilter={setCategoriesFilter}
                        setBrandsFilter={setBrandsFilter}
                        ratingFilter={ratingFilter}
                        priceOrder={priceOrder}
                        categoriesFilter={categoriesFilter}
                        brandsFilter={brandsFilter}
                    />
                    <Footer />
                </React.StrictMode>
            </ApolloProvider>
        </BrowserRouter >
    )
}
