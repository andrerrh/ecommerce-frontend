import React, { useEffect, useState, Fragment } from "react";
import { useQuery, useMutation } from "@apollo/client"
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { v4 as uuid } from 'uuid'
import { useNavigate } from "react-router-dom";

import Button from '../common/Button'
import './ProductManagement.scss'
import ProductModal from './ProductModal'
import { ALL_PRODUCTS, DELETE_PRODUCT } from '../../queries'

export default function ProductManagement() {
    const navigate = useNavigate()

    const localId = localStorage.getItem('id')
    if(localId === 'null') navigate('/login')

    const [modalUpdateMode, setModalUpdateMode] = useState()
    const [productToUpdate, setProductToUpdate] = useState([])
    const [products, setProducts] = useState([])

    function openModal(e) {
        e.target.innerText === "Adicionar" ? setModalUpdateMode(false) : setModalUpdateMode(true)

        const modal = document.querySelector('.modal-container')
        modal.style.display = 'flex'
    }

    const { data, refetch: refetchProducts } = useQuery(ALL_PRODUCTS)
    const [mutateDeleteProduct] = useMutation(DELETE_PRODUCT)

    useEffect(() => {
        async function setData() {
            setProducts(await data.products)
        }
        setData()
    }, [data])

    function deleteProduct(productId) {
        const confirmDelete = window.confirm("Deseja excluir este produto?")
        if (confirmDelete) {
            const result = mutateDeleteProduct({ variables: { id: productId } })
            result.then(() => refetchProducts())
        }
    }

    return (
        <Fragment >
            <ProductModal
                refetchProducts={refetchProducts}
                modalUpdateMode={modalUpdateMode}
                productToUpdate={productToUpdate}
            />
            <div className="product-management">
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Preço</th>
                            <th>Avaliação(Positivas/Total)</th>
                            <th>Descrição</th>
                            <th>Imagens</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products && products?.map((p, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{p.name}</td>
                                        <td>{p.price}</td>
                                        <td>{p.positive_rating}/{p.total_rating}</td>
                                        <td>
                                            <details>
                                                <summary>Pressione para visualizar</summary>
                                                <p>{p.description}</p>
                                            </details>
                                        </td>
                                        <td className="images">
                                            <a className={p.image1 ? '' : 'hidden'} href={p.image1}>Image 1</a>
                                            <a className={p.image2 ? '' : 'hidden'} href={p.image2}>Image 2</a>
                                            <a className={p.image3 ? '' : 'hidden'} href={p.image3}>Image 3</a>
                                            <a className={p.image4 ? '' : 'hidden'} href={p.image4}>Image 4</a>
                                            <a className={p.image5 ? '' : 'hidden'} href={p.image5}>Image 5</a>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => deleteProduct(p.id)}
                                                className="trash">
                                                <FontAwesomeIcon icon={solid('trash-can')} />
                                            </button>
                                            <button className="edit"
                                                onClick={(e) => {
                                                    openModal(e)
                                                    setProductToUpdate([p, uuid()])
                                                }
                                                }
                                            >
                                                <FontAwesomeIcon icon={solid('pen')} />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                <span className='add'>
                    <Button
                        onclick={openModal}
                        action='Adicionar'
                    />
                </span>
            </div>
        </Fragment>
    )

}