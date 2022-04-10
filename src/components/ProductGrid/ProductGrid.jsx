import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Amplify from "aws-amplify"

import awsconfig from "../../aws-exports"
import "./ProductGrid.scss"
import ProductCard from "../ProductCard/ProductCard";
import { gql, useQuery } from "@apollo/client"

Amplify.configure(awsconfig)

const PRODUCTS = gql`
query {
    products {
        id
        name
        price
        positive_rating
        total_rating
        image1
        image2
        image3
        image4
        image5
        id_categories
        brands {
            id
            name
        }
        categories {
            name
        }
    }
}
`

function ProductGrid({ ratingFilter, brandsFilter, priceOrder, categoriesFilter }) {

    const [products, setProducts] = useState([])

    const { loading, error, data } = useQuery(PRODUCTS)

    useEffect(() => {
        if (error) alert(error)
        if (loading === false && data) {
            let orderedArray = data.products.slice()
            if (priceOrder === 'asc') orderedArray.sort((a, b) => a.price - b.price)
            if (priceOrder === 'desc') orderedArray.sort((a, b) => b.price - a.price)
            setProducts(orderedArray)
        }
    }, [loading, data, error, priceOrder])

    return (
        <div className="product-grid">
            {
                products?.filter((p) => {
                    const ratingRatio = p.positive_rating / p.total_rating * 5
                    const brandFilter = brandsFilter.length > 0 ? brandsFilter.includes(p.brands.id) : true
                    const categoryFilter = categoriesFilter !== 0 ? p.id_categories === categoriesFilter : true
                    return ratingRatio >= ratingFilter && brandFilter && categoryFilter
                }).map((p, i) => {
                    return <Link key={i} to='/product' state={{ id: p.id }} style={{ textDecoration: 'none', color: 'black' }}>
                        <ProductCard
                            productName={p.name}
                            productPrice={p.price}
                            productBrand={p.brands.name}
                            productCategory={p.categories.name}
                            productRating={{ rate: p.positive_rating / p.total_rating * 5, total: p.total_rating }}
                            productImage={p.image1}
                        />
                    </Link>
                })
            }
        </div>
    )
}

export default ProductGrid