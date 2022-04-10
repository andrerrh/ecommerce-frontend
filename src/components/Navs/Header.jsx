import React, { Fragment, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { useQuery } from '@apollo/client'

import './Header.scss'
import Logo from '../../assets/imgs/logo192.png'
import avatarDefaultImage from "../../assets/imgs/default-user.jpg"
import { PRODUCT_BRAND_CATEGORIES, USER_NAME_EMAIL_AVATAR } from '../../queries'

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

export default function Header({ setCategoriesFilter, setBrandsFilter }) {

    const [smartphoneCategs, setSmartphoneCategs] = useState()
    const [computerCategs, setComputerCategs] = useState()
    const [accessoriesCategs, setAcessoriesCategs] = useState()
    const [user, setUser] = useState()
    const [logged, setLogged] = useState(false)

    const { loading, error, data } = useQuery(PRODUCT_BRAND_CATEGORIES)
    const { loading: userLoading, error: userError, data: userData } = useQuery(USER_NAME_EMAIL_AVATAR, {
        variables: {
            id: localStorage.getItem('id')
        }
    })

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

    useEffect(() => {
        if (userError) console.log("Error querying products")
        if (!userLoading && userData) {
            setUser(userData.user)
        }
    }, [userLoading, userData, userError])

    const location = useLocation()

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

    const navigate = useNavigate()

    return (
        <Fragment>
            <header>
                <span className='logo'
                    onClick={() => {
                        navigate('/')
                        setCategoriesFilter(0)
                        setBrandsFilter(0)
                    }}
                >
                    <img src={Logo} alt="react-logo" />
                </span>
                <span>
                    <p className='p-spacer'>A</p>
                    <p className='main-category'>Smartphones</p>
                    <p className='drop-arrows'>
                        <FontAwesomeIcon icon={solid('angle-down')} />
                    </p>
                    <div className="dropdown">
                        {
                            smartphoneCategs && smartphoneCategs.map((e, i) => {
                                return <button
                                    key={`smartphones${i}`}
                                    onClick={() => {
                                        navigate('/')
                                        setBrandsFilter([parseInt(e.brands_id)])
                                        setCategoriesFilter(parseInt(e.categories_id))
                                    }}
                                >
                                    {e.brands_name}
                                </button>
                            })
                        }
                    </div>
                </span>
                <span >
                    <p className='p-spacer'>A</p>
                    <p className='main-category'>Computadores</p>
                    <p className='drop-arrows'>
                        <FontAwesomeIcon icon={solid('angle-down')} />
                    </p>
                    <div className="dropdown">
                        {
                            computerCategs && computerCategs.map((e, i) => {
                                return <button
                                    key={`computers${i}`}
                                    onClick={() => {
                                        navigate('/')
                                        setBrandsFilter([parseInt(e.brands_id)])
                                        setCategoriesFilter(parseInt(e.categories_id))
                                    }}
                                >
                                    {e.brands_name}
                                </button>
                            })
                        }
                    </div>
                </span>
                <span>
                    <p className='p-spacer'>A</p>
                    <p className='main-category'>Periféricos</p>
                    <p className='drop-arrows'>
                        <FontAwesomeIcon icon={solid('angle-down')} />
                    </p>
                    <div className="dropdown">
                        {
                            accessoriesCategs && accessoriesCategs.map((e, i) => {
                                return <button
                                    key={`accs=${i}`}
                                    onClick={() => {
                                        navigate('/')
                                        setBrandsFilter([parseInt(e.brands_id)])
                                        setCategoriesFilter(parseInt(e.categories_id))
                                    }}
                                >
                                    {e.brands_name}
                                </button>
                            })
                        }
                    </div>
                </span>
                {!logged && <span
                    className='login-container'
                    onClick={() => navigate('/login')}>
                    <button className='login-btn'>Login</button>
                </span>}
                {logged && <span className='avatar-container'>
                    <img className='avatar-img' src={user?.avatar || avatarDefaultImage} alt="Default user" />
                    <div className="dropdown" id='avatar-dropdown'>
                        <a
                            href="/productadm">
                            <p className="a-text">Gerenciar Produtos</p>
                            <p className="a-icon"><FontAwesomeIcon icon={solid('file')} /></p>
                        </a>
                        <a href='/Cart'>
                            <p className="a-text">Meu carrinho</p>
                            <p className="a-icon"><FontAwesomeIcon icon={solid('shopping-cart')} /></p>
                        </a>
                        <a href='/account'>
                            <p className="a-text">Minha Conta</p>
                            <p className="a-icon"><FontAwesomeIcon icon={solid('user-astronaut')} /></p>
                        </a>
                        <a href='/purchases'>
                            <p className="a-text">Minhas compras</p>
                            <p className="a-icon"><FontAwesomeIcon icon={solid('bag-shopping')} /></p>
                        </a>
                        <a href='/login'
                            onClick={logoff}>
                            <p className="a-text">Sair</p>
                            <p className="a-icon"><FontAwesomeIcon icon={solid('door-open')} /></p>
                        </a>
                    </div>
                </span>}
            </header>
        </Fragment>
    )
}