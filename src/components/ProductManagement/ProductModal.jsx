import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { useQuery, useMutation } from '@apollo/client'
import Amplify, { Storage } from "aws-amplify"
import { v4 as uuid } from 'uuid'

import awsconfig from "../../aws-exports"
import './ProductModal.scss'
import SelectInput from '../common/SelectInput'
import Button from '../common/Button'
import { BRANDS_AND_CATEGORIES, ADD_BRAND, ADD_CATEGORY, ADD_PRODUCT, UPDATE_PRODUCT } from '../../queries'

Amplify.configure(awsconfig)

const {
    aws_user_files_s3_bucket: bucket,
    aws_user_files_s3_bucket_region: bucketRegion
} = awsconfig

export default function ProductModal(props) {

    const productToUpdate = props.productToUpdate[0]

    const [updateModal, setUpdateModal] = useState(false)
    const [productInfo, setProductInfo] = useState({})
    const [images, setImages] = useState({})
    const [imagesNames, setImagesNames] = useState({})
    const [queriedBrands, setQueriedBrands] = useState()
    const [queriedCategories, setQueriedCategories] = useState()
    const [category, setCategory] = useState(1)
    const [brand, setBrand] = useState(1)
    const [addBrandField, setAddBrandField] = useState(false)
    const [addCategoryField, setAddCategoryField] = useState(false)
    const [brandToAdd, setBrandToAdd] = useState()
    const [categoryToAdd, setCategoryToAdd] = useState()
    const [selectedBrandUpdate, setSelectedBrandUpdate] = useState()
    const [selectedCategoryUpdate, setSelectedCategoryUpdate] = useState()

    const { loading, error, data, refetch: refetchBrandsAndCategories } = useQuery(BRANDS_AND_CATEGORIES)
    const [mutateAddBrand] = useMutation(ADD_BRAND)
    const [mutateAddCategory] = useMutation(ADD_CATEGORY)
    const [mutateAddProduct] = useMutation(ADD_PRODUCT)
    const [mutateUpdateProduct] = useMutation(UPDATE_PRODUCT)

    useEffect(() => {
        if (props.modalUpdateMode && !updateModal) setUpdateModal(true)
        if (!props.modalUpdateMode) setUpdateModal(false)
    }, [props.modalUpdateMode, updateModal])

    useEffect(() => {
        if (data && !loading && !error) {
            setQueriedBrands(data.brands)
            setQueriedCategories(data.categories)
        }
    }, [loading, error, data])

    useEffect(() => {
        if (productToUpdate) {
            setProductInfo({
                id: productToUpdate.id,
                name: productToUpdate.name,
                price: productToUpdate.price,
                description: productToUpdate.description,
                positive_rating: productToUpdate.positive_rating,
                total_rating: productToUpdate.total_rating
            })
            setSelectedBrandUpdate(productToUpdate.id_brands)
            setSelectedCategoryUpdate(productToUpdate.id_categories)
            setImagesNames({
                image1: productToUpdate.image1,
                image2: productToUpdate.image2,
                image3: productToUpdate.image3,
                image4: productToUpdate.image4,
                image5: productToUpdate.image5
            })
        }

    }, [productToUpdate])

    function handleImageChange(image, imageLabel) {
        setImages({ ...images, [imageLabel]: image.target.files[0] })
        setImagesNames({ ...imagesNames, [imageLabel]: image.target.value })
    }

    function removeImage(imageLabel) {
        setImages({ ...images, [imageLabel]: undefined })
        setImagesNames({ ...imagesNames, [imageLabel]: undefined })
    }

    function closeModal(e, forceClose) {
        if (e?.target?.className === 'modal-container' || e?.target?.className === "close-modal-btn" || forceClose) {
            document.querySelector('.modal-container').style.display = 'none'
            setUpdateModal(false)
            cleanModal()
        }
    }

    function cleanModal() {
        setProductInfo('')
        setImages('')
        setImagesNames('')
    }

    async function uploadImage(file, key) {
        await Storage.put(key, file)
    }

    function addProduct() {
        const imagesUrls = {}
        if (images.image1) {
            const fileName = images.image1.name.replace(/\s/g, '')
            const key = `images/${uuid()}${fileName}`
            uploadImage(images.image1, key)
            imagesUrls.image1 = `https://${bucket}.s3.${bucketRegion}.amazonaws.com/public/${key}`
        }
        if (images.image2) {
            const fileName = images.image1.name.replace(/\s/g, '')
            const key = `images/${uuid()}${fileName}`
            uploadImage(images.image2, key)
            imagesUrls.image2 = `https://${bucket}.s3.${bucketRegion}.amazonaws.com/public/${key}`
        }
        if (images.image3) {
            const fileName = images.image1.name.replace(/\s/g, '')
            const key = `images/${uuid()}${fileName}`
            uploadImage(images.image3, key)
            imagesUrls.image3 = `https://${bucket}.s3.${bucketRegion}.amazonaws.com/public/${key}`
        }
        if (images.image4) {
            const fileName = images.image1.name.replace(/\s/g, '')
            const key = `images/${uuid()}${fileName}`
            uploadImage(images.image4, key)
            imagesUrls.image4 = `https://${bucket}.s3.${bucketRegion}.amazonaws.com/public/${key}`
        }
        if (images.image5) {
            const fileName = images.image1.name.replace(/\s/g, '')
            const key = `images/${uuid()}${fileName}`
            uploadImage(images.image5, key)
            imagesUrls.image5 = `https://${bucket}.s3.${bucketRegion}.amazonaws.com/public/${key}`
        }

        if (!productInfo.name || !productInfo.price || !productInfo.description || !productInfo.positive_rating || !productInfo.total_rating) {
            alert("Por favor, preencha todos os campos")
            return
        }

        const result = mutateAddProduct({
            variables: {
                name: productInfo.name,
                price: parseFloat(productInfo.price),
                description: productInfo.description,
                positive_rating: parseInt(productInfo.positive_rating),
                total_rating: parseInt(productInfo.total_rating),
                image1: imagesUrls.image1,
                image2: imagesUrls.image2,
                image3: imagesUrls.image3,
                image4: imagesUrls.image4,
                image5: imagesUrls.image5,
                id_brands: parseInt(brand),
                id_categories: parseInt(category)
            }
        })

        result.then((res) => {
            props.refetchProducts()
            cleanModal()
            closeModal(null, true)
        })
    }

    async function updateProduct() {
        const imagesUrls = {}
        if (images.image1) {
            const fileName = images.image1.name.replace(/\s/g, '')
            const key = `images/${uuid()}${fileName}`
            uploadImage(images.image1, key)
            imagesUrls.image1 = `https://${bucket}.s3.${bucketRegion}.amazonaws.com/public/${key}`
        }
        if (images.image2) {
            const fileName = images.image1.name.replace(/\s/g, '')
            const key = `images/${uuid()}${fileName}`
            uploadImage(images.image2, key)
            imagesUrls.image2 = `https://${bucket}.s3.${bucketRegion}.amazonaws.com/public/${key}`
        }
        if (images.image3) {
            const fileName = images.image1.name.replace(/\s/g, '')
            const key = `images/${uuid()}${fileName}`
            uploadImage(images.image3, key)
            imagesUrls.image3 = `https://${bucket}.s3.${bucketRegion}.amazonaws.com/public/${key}`
        }
        if (images.image4) {
            const fileName = images.image1.name.replace(/\s/g, '')
            const key = `images/${uuid()}${fileName}`
            uploadImage(images.image4, key)
            imagesUrls.image4 = `https://${bucket}.s3.${bucketRegion}.amazonaws.com/public/${key}`
        }
        if (images.image5) {
            const fileName = images.image1.name.replace(/\s/g, '')
            const key = `images/${uuid()}${encodeURI(fileName)}`
            uploadImage(images.image5, key)
            imagesUrls.image5 = `https://${bucket}.s3.${bucketRegion}.amazonaws.com/public/${key}`
        }

        if (!productInfo.name || !productInfo.price || !productInfo.description || !productInfo.positive_rating || !productInfo.total_rating) {
            alert("Por favor, preencha todos os campos")
            return
        }

        const result = mutateUpdateProduct({
            variables: {
                id: productInfo.id,
                name: productInfo.name,
                price: parseFloat(productInfo.price),
                description: productInfo.description,
                positive_rating: parseInt(productInfo.positive_rating),
                total_rating: parseInt(productInfo.total_rating),
                image1: imagesUrls.image1,
                image2: imagesUrls.image2,
                image3: imagesUrls.image3,
                image4: imagesUrls.image4,
                image5: imagesUrls.image5,
                id_brands: parseInt(brand),
                id_categories: parseInt(category)
            }
        })

        result.then(() => {
            props.refetchProducts()
            cleanModal()
            closeModal(null, true)
        })
    }

    function addNewBrandOrCategory(type) {
        if (type === 'brand') {
            mutateAddBrand({ variables: { name: brandToAdd } }).then(res => refetchBrandsAndCategories())
            setAddBrandField(false)
            setBrandToAdd('')
        } else {
            mutateAddCategory({ variables: { name: categoryToAdd } }).then(res => refetchBrandsAndCategories())
            setAddCategoryField(false)
            setCategoryToAdd('')
        }
    }

    function cancelNewBrandOrCategory(cleanField, closeField) {
        cleanField()
        closeField()
    }

    return (
        <div className='modal-container'
            onMouseDown={closeModal}>
            <div className='modal'>
                <button
                    onClick={closeModal}
                    className="close-modal-btn">
                    X
                </button>
                <input
                    type="text"
                    name="name"
                    id="product-name"
                    placeholder="Nome do produto"
                    autoComplete='off'
                    value={productInfo.name == null ? '' : productInfo.name}
                    onChange={(e) => setProductInfo({ ...productInfo, name: e.target.value })}
                />
                <input
                    type="number"
                    name="price"
                    id="product-price"
                    placeholder="Preço do produto"
                    autoComplete='off'
                    value={productInfo.price == null ? '' : productInfo.price}
                    onChange={(e) => setProductInfo({ ...productInfo, price: e.target.value })}
                />
                <input
                    type="text"
                    name="description"
                    id="product-description"
                    placeholder="Descrição do produto"
                    autoComplete='off'
                    value={productInfo.description == null ? '' : productInfo.description}
                    onChange={(e) => setProductInfo({ ...productInfo, description: e.target.value })}
                />
                <input
                    type="number"
                    name="positive_rating"
                    id="product-positive_rating"
                    placeholder="Avaliações positivas(Exemplo de demonstração)"
                    autoComplete='off'
                    value={productInfo.positive_rating == null ? '' : productInfo.positive_rating}
                    onChange={(e) => setProductInfo({ ...productInfo, positive_rating: e.target.value })}
                />
                <input
                    type="number"
                    name="total_rating"
                    id="product-total_rating"
                    placeholder="Avaliações totais(Exemplo de demonstração)"
                    autoComplete='off'
                    value={productInfo.total_rating == null ? '' : productInfo.total_rating}
                    onChange={(e) => setProductInfo({ ...productInfo, total_rating: e.target.value })}
                />

                <div className="selects-container">
                    {
                        queriedBrands &&
                        !addBrandField &&
                        <SelectInput
                            options={queriedBrands}
                            select={setBrand}
                            selectedId={selectedBrandUpdate}
                            placeholder="marca" />}
                    {
                        addBrandField &&
                        <>
                            <input
                                placeholder='Nova marca'
                                className="new-element-input"
                                value={brandToAdd || ''}
                                onChange={(e) => setBrandToAdd(e.target.value)}
                            />
                            <Button
                                action="Add"
                                onclick={() => addNewBrandOrCategory('brand')}
                            />
                            <Button
                                action="X"
                                onclick={() => cancelNewBrandOrCategory(setBrandToAdd, setAddBrandField)}
                            />
                        </>
                    }
                    <Button
                        action="+"
                        onclick={() => setAddBrandField(!addBrandField)}
                    />
                </div>

                <div className="selects-container">
                    {
                        queriedCategories &&
                        !addCategoryField &&
                        <SelectInput
                            options={queriedCategories}
                            select={setCategory}
                            selectedId={selectedCategoryUpdate}
                            placeholder="categoria" />}
                    {
                        addCategoryField &&
                        <>
                            <input
                                placeholder='Nova categoria'
                                className="new-element-input"
                                value={categoryToAdd || ''}
                                onChange={(e) => setCategoryToAdd(e.target.value)}
                            />
                            <Button
                                action="Add"
                                onclick={() => addNewBrandOrCategory('category')}
                            />
                            <Button
                                action="X"
                                onclick={() => cancelNewBrandOrCategory(setCategoryToAdd, setAddCategoryField)}
                            />
                        </>
                    }
                    <Button
                        action="+"
                        onclick={() => setAddCategoryField(!addCategoryField)}
                    />
                </div>

                {/* Add, select, delete image fields */}
                <label htmlFor="product-image1" className="product-image-label">
                    <input type="file" name="image1" id="product-image1"
                        onChange={(e) => handleImageChange(e, 'image1')} />
                    <span >Imagem 1</span>
                    <span className='image-name-label' id="image1-name">{imagesNames.image1}</span>
                    <button className="trash"
                        onClick={() => removeImage('image1')}>
                        <FontAwesomeIcon icon={solid('trash-can')} />
                    </button>
                </label>
                <label htmlFor="product-image2" className="product-image-label">
                    <input type="file" name="image2" id="product-image2"
                        onChange={(e) => handleImageChange(e, 'image2')} />
                    <span >Imagem 2</span>
                    <span className='image-name-label' id="image2-name">{imagesNames.image2}</span>
                    <button className="trash"
                        onClick={() => removeImage('image2')}>
                        <FontAwesomeIcon icon={solid('trash-can')} />
                    </button>
                </label>
                <label htmlFor="product-image3" className="product-image-label">
                    <input type="file" name="image3" id="product-image3"
                        onChange={(e) => handleImageChange(e, 'image3')} />
                    <span >Imagem 3</span>
                    <span className='image-name-label' id="image3-name">{imagesNames.image3}</span>
                    <button className="trash"
                        onClick={() => removeImage('image3')}>
                        <FontAwesomeIcon icon={solid('trash-can')} />
                    </button>
                </label>
                <label htmlFor="product-image4" className="product-image-label">
                    <input type="file" name="image4" id="product-image4"
                        onChange={(e) => handleImageChange(e, 'image4')} />
                    <span >Imagem 4</span>
                    <span className='image-name-label' id="image4-name">{imagesNames.image4}</span>
                    <button className="trash"
                        onClick={() => removeImage('image4')}>
                        <FontAwesomeIcon icon={solid('trash-can')} />
                    </button>
                </label>
                <label htmlFor="product-image5" className="product-image-label">
                    <input type="file" name="image5" id="product-image5"
                        onChange={(e) => handleImageChange(e, 'image5')} />
                    <span >Imagem 5</span>
                    <span className='image-name-label' id="image5-name">{imagesNames.image5}</span>
                    <button className="trash"
                        onClick={() => removeImage('image5')}>
                        <FontAwesomeIcon icon={solid('trash-can')} />
                    </button>
                </label>
                <span className="modal-actions">
                    {!updateModal && <Button
                        onclick={addProduct}
                        action="Adicionar"
                    />}
                    {updateModal && <Button
                        onclick={updateProduct}
                        action="Atualizar"
                    />}
                    <Button
                        onclick={cleanModal}
                        action="Cancelar"
                    />
                </span>
            </div>
        </div>
    )
}