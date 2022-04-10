import React, { useState, useEffect, useRef } from 'react'
import { useQuery } from '@apollo/client'
import { useLocation, useNavigate } from 'react-router-dom'

import './Navbar.scss'
import ButtonOpen from '../common/ButtonOpen'
import { PRODUCT_BRAND_CATEGORIES } from '../../queries'

export default function Navbar({ setCategoriesFilter, setBrandsFilter, setPriceOrder, resetFilters }) {

    let location = useLocation()

    const navbarRef = useRef()

    const navigate = useNavigate()

    const [smartphoneCategs, setSmartphoneCategs] = useState()
    const [computerCategs, setComputerCategs] = useState()
    const [accessoriesCategs, setAcessoriesCategs] = useState()
    const [navbarClasses, setNavbarClasses] = useState('lateral-navbar hidden')
    const [brandsClasses, setBrandsClasses] = useState({
        phone: 'brand-container brands-hidden',
        computer: 'brand-container brands-hidden',
        accessories: 'brand-container brands-hidden'
    })
    const [brandsButtonClasses, setBrandsButtonClasses] = useState({})
    const [logged, setLogged] = useState(false)


    const { loading, error, data } = useQuery(PRODUCT_BRAND_CATEGORIES)

    const filterBrands = (element, category) => {
        const accumulator = []
        element.forEach((product) => {
            const exists = accumulator.map((e) => e.brands_id).indexOf(product.brands.id) !== -1
            if (product.categories.name === category && !exists) {
                accumulator.push({ brands_id: product.brands.id, brands_name: product.brands.name, categories_id: product.categories.id })
            }
        })
        return accumulator
    }

    useEffect(() => {
        if (error) console.log("Error querying products")
        if (!loading && data) {
            const filteredSmartphoneBrands = filterBrands(data.products, "Smartphones")
            setSmartphoneCategs(filteredSmartphoneBrands)
            const filteredComputerBrands = filterBrands(data.products, "Computadores")
            setComputerCategs(filteredComputerBrands)
            const filteredAccessoriesBrands = filterBrands(data.products, "Periféricos")
            setAcessoriesCategs(filteredAccessoriesBrands)
        }
    }, [loading, data, error])

    //Sets when navbar will appear based on the current page
    useEffect(() => {
        if (location.pathname !== '/') {
            navbarRef.current.style.display = 'none'
        } else {
            navbarRef.current.style.display = 'flex'
        }
    }, [location])

    //Navbar animations
    const openCloseNavbar = () => {
        if (navbarClasses.includes('hidden')) {
            setNavbarClasses('lateral-navbar')
        } else {
            setNavbarClasses('lateral-navbar hidden')
        }
    }

    const openCloseBrands = (category, i) => {
        const containers = Array.from(document.querySelectorAll('.brand-container'))
        if (containers[i].classList.contains('brands-hidden')) {
            setBrandsClasses({ ...brandsClasses, [category]: 'brand-container' })
            setBrandsButtonClasses({ ...brandsButtonClasses, [category]: 'extend-button-active' })
        } else {
            setBrandsClasses({ ...brandsClasses, [category]: 'brand-container brands-hidden' })
            setBrandsButtonClasses({ ...brandsButtonClasses, [category]: '' })

        }
    }

    //Login
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!logged && token === 'token123') {
            setLogged(true)
        }
    }, [location, logged])

    //Logoff
    const logoff = () => {
        setLogged(false)
        localStorage.setItem('token', null)
        localStorage.setItem('id', null)
    }

    return (
        <nav
            className={navbarClasses}
            ref={navbarRef}
        >
            <ButtonOpen click={openCloseNavbar} />
            <div className="filters">
                <button
                    className='reset-button'
                    onClick={resetFilters}
                >
                    Resetar filtros
                </button>
                <h4>Categorias</h4>
                <div className="category-container">
                    <span onClick={() => {
                        openCloseBrands('phone', 0)
                    }}
                        className='category-name-button-container'>
                        <h5>Smartphones</h5>
                        <button className={brandsButtonClasses.phone}>+</button>
                    </span>
                    <div className={brandsClasses.phone}>
                        {
                            smartphoneCategs && smartphoneCategs.map((e, i) => {
                                return <button
                                    key={`smartphones${i}`}
                                    onClick={() => {
                                        setBrandsFilter([parseInt(e.brands_id)])
                                        setCategoriesFilter(parseInt(e.categories_id))
                                    }}
                                >
                                    {e.brands_name}
                                </button>
                            })
                        }
                    </div>
                </div>
                <div className="category-container">
                    <span onClick={(e) => {
                        openCloseBrands('computer', 1)
                    }}
                        className='category-name-button-container'>
                        <h5>Computadores</h5>
                        <button className={brandsButtonClasses.computer}>+</button>
                    </span>
                    <div className={brandsClasses.computer}>
                        {
                            computerCategs && computerCategs.map((e, i) => {
                                return <button
                                    key={`computers${i}`}
                                    onClick={() => {
                                        setBrandsFilter([parseInt(e.brands_id)])
                                        setCategoriesFilter(parseInt(e.categories_id))
                                    }}
                                >
                                    {e.brands_name}
                                </button>
                            })
                        }
                    </div>
                </div>
                <div className="category-container">
                    <span onClick={(e) => {
                        openCloseBrands('accessories', 2)
                    }}
                        className='category-name-button-container'>
                        <h5>Periféricos</h5>
                        <button className={brandsButtonClasses.accessories}>+</button>
                    </span>
                    <div className={brandsClasses.accessories}>
                        {
                            accessoriesCategs && accessoriesCategs.map((e, i) => {
                                return <button
                                    key={`accs=${i}`}
                                    onClick={() => {
                                        setBrandsFilter([parseInt(e.brands_id)])
                                        setCategoriesFilter(parseInt(e.categories_id))
                                    }}
                                >
                                    {e.brands_name}
                                </button>
                            })
                        }
                    </div>
                </div>
                <h4 className='price-text'>Preço</h4>
                <div className="price-filter-container">
                    <label htmlFor="price1">Menor preço ao maior preço
                        <input
                            onClick={() => {
                                setPriceOrder('asc')
                            }}
                            type="radio" id='priceAsc' name='price' value='asc' />
                        <span className="radio-check"></span>
                    </label>
                    <label htmlFor="priceDesc">Maior preço ao menor preço
                        <input
                            onClick={() => {
                                setPriceOrder('desc')
                            }}
                            type="radio" id='price2' name='price' value='desc' />
                    </label>
                </div>
                {!logged && <div className='nav-login'>
                    <button
                        className='login-text'
                        onClick={() => navigate('/login')}>
                        Fazer login
                    </button>
                </div>}
                {logged && <div className="user-settings">
                    <a
                        href="/productadm"
                    >
                        Gerenciar Produtos
                    </a>
                    <a href='/Cart'>Meu carrinho</a>
                    <a href='/account'>Minha Conta</a>
                    <a href='/purchases'>Minhas Compras</a>
                    <a href='/login'
                        onClick={logoff}>
                        Sair</a>
                </div>}
            </div>
        </nav>
    )
}