import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { useQuery } from '@apollo/client'

import './Aside.scss'
import { GET_BRANDS } from '../../queries'

function Aside(props) {

    const [brands, setBrands] = useState()

    const { loading, error, data } = useQuery(GET_BRANDS)

    useEffect(() => {
        if (error) alert("Erro ao receber filtros de marcas")
        if (!loading && data) {
            setBrands(data.brands)
        }
    }, [data, loading, error])

    const handleBrandChange = (e) => {
        const brandsToFilter = props.brandsFilter
        if(e.target.checked) {
            props.setBrandsFilter([...brandsToFilter, parseInt(e.target.id)])
        } else {
            brandsToFilter.splice(brandsToFilter.indexOf(parseInt(e.target.id)), 1)
            props.setBrandsFilter([...brandsToFilter])
        }
    }

    return (
        <aside className='aside-menu'>
            <h3 className='filters'>Filtros</h3>
            <button className="reset-btn" onClick={() => props.resetFilters()}>Resetar filtros</button>
            <p className="filter-type">Avaliação</p>
            <div className="rating-star-container">
                <div
                    onClick={() => props.setRatingFilter(1)}
                >
                    <FontAwesomeIcon icon={solid('star')} className='rating-star' />
                    <FontAwesomeIcon icon={solid('star')} className='rating-star-stroke' />
                    <FontAwesomeIcon icon={solid('star')} className='rating-star-stroke' />
                    <FontAwesomeIcon icon={solid('star')} className='rating-star-stroke' />
                    <FontAwesomeIcon icon={solid('star')} className='rating-star-stroke' />
                    <p>1 Estrela ou mais</p>
                </div>
                <div
                    onClick={() => props.setRatingFilter(2)}>
                    <FontAwesomeIcon icon={solid('star')} className='rating-star' />
                    <FontAwesomeIcon icon={solid('star')} className='rating-star' />
                    <FontAwesomeIcon icon={solid('star')} className='rating-star-stroke' />
                    <FontAwesomeIcon icon={solid('star')} className='rating-star-stroke' />
                    <FontAwesomeIcon icon={solid('star')} className='rating-star-stroke' />
                    <p>2 Estrelas ou mais</p>
                </div>
                <div
                    onClick={() => props.setRatingFilter(3)}>
                    <FontAwesomeIcon icon={solid('star')} className='rating-star' />
                    <FontAwesomeIcon icon={solid('star')} className='rating-star' />
                    <FontAwesomeIcon icon={solid('star')} className='rating-star' />
                    <FontAwesomeIcon icon={solid('star')} className='rating-star-stroke' />
                    <FontAwesomeIcon icon={solid('star')} className='rating-star-stroke' />
                    <p>3 Estrelas ou mais</p>
                </div>
                <div
                    onClick={() => props.setRatingFilter(4)}
                >
                    <FontAwesomeIcon icon={solid('star')} className='rating-star' />
                    <FontAwesomeIcon icon={solid('star')} className='rating-star' />
                    <FontAwesomeIcon icon={solid('star')} className='rating-star' />
                    <FontAwesomeIcon icon={solid('star')} className='rating-star' />
                    <FontAwesomeIcon icon={solid('star')} className='rating-star-stroke' />
                    <p>4 Estrelas ou mais</p>
                </div>
                <div
                    onClick={() => props.setRatingFilter(5)}
                >
                    <FontAwesomeIcon icon={solid('star')} className='rating-star' />
                    <FontAwesomeIcon icon={solid('star')} className='rating-star' />
                    <FontAwesomeIcon icon={solid('star')} className='rating-star' />
                    <FontAwesomeIcon icon={solid('star')} className='rating-star' />
                    <FontAwesomeIcon icon={solid('star')} className='rating-star' />
                    <p>5 Estrelas ou mais</p>
                </div>
            </div>
            <p className="filter-type">Preço</p>
            <div className="price-filter-container">
                <label htmlFor="price1">Menor preço ao maior preço
                    <input 
                    onClick={() => props.setPriceOrder('asc')}
                    type="radio" id='priceAsc' name='price' value='asc' />
                    <span className="radio-check"></span>
                </label>
                <label htmlFor="priceDesc">Maior preço ao menor preço
                    <input 
                    onClick={() => props.setPriceOrder('desc')}
                    type="radio" id='price2' name='price' value='desc' />
                </label>
            </div>
            <p className="filter-type">Marca</p>
            <div className="brand-filter-container">
                {
                    brands && brands.map((b) => {
                            return <label 
                            key={`brandsFilter${b.id}`} 
                            htmlFor={b.id}>{b.name}
                                <input 
                                type="checkbox" 
                                name={b.name} 
                                onChange={handleBrandChange}
                                id={b.id} />
                            </label>
                    })
                }
            </div>

        </aside>
    )
}

export default Aside