import React, { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { useMutation, useQuery } from '@apollo/client'
import Amplify, { Storage } from "aws-amplify"
import { v4 as uuid } from 'uuid'
import { useNavigate } from 'react-router-dom'

import awsconfig from "../../aws-exports"
import './Account.scss'
import defaultAvatar from '../../assets/imgs/default-user.jpg'
import Button from '../common/Button'
import { UPDATE_USER, UPDATE_PASSWORD, USER_NAME_EMAIL_AVATAR } from '../../queries'
import showAlert from '../common/showAlert'

Amplify.configure(awsconfig)

const {
    aws_user_files_s3_bucket: bucket,
    aws_user_files_s3_bucket_region: bucketRegion
} = awsconfig

export default function Account() {
    const navigate = useNavigate()

    const localId = localStorage.getItem('id')
    if(localId === 'null') navigate('/login')

    const [passwordButtonIcon, setPasswordButtonIcon] = useState({
        oldPassword: { icon: <FontAwesomeIcon icon={solid('eye')} />, type: 'eye' },
        newPassword: { icon: <FontAwesomeIcon icon={solid('eye')} />, type: 'eye' }
    })
    const [userInfo, setUserInfo] = useState({
        avatar: '',
        name: '',
        email: ''
    })
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: ''
    })
    const [newImageDisplay, setNewImageDisplay] = useState()
    const [newImage, setNewImage] = useState()

    const firstFragment = useRef()
    const secondFragment = useRef()
    const oldPasswordEye = useRef()
    const newPasswordEye = useRef()
    const imageInput = useRef()
    const alertsRef = useRef()

    const {loading, error, data} = useQuery(USER_NAME_EMAIL_AVATAR, {variables: {id: parseInt(localStorage.getItem('id'))}})
    const [updateUserMutate] = useMutation(UPDATE_USER)
    const [updatePasswordMutate] = useMutation(UPDATE_PASSWORD)

    useEffect(() => {
        oldPasswordEye.current.style.display = 'none'
        newPasswordEye.current.style.display = 'none'
    }, [])

    useEffect(() => {
        if(error) return alert(error)
        if(!loading && data) {
            setUserInfo({
                name: data.user.name,
                email: data.user.email,
                avatar: data.user.avatar
            })
        }
    },[error, loading, data])



    const moveToFirstFragment = () => {
        firstFragment.current.style.transform = 'translateY(0%)'
        secondFragment.current.style.transform = 'translateY(0%)'
        oldPasswordEye.current.style.display = 'none'
        newPasswordEye.current.style.display = 'none'
    }
    const moveToSecondFragment = () => {
        firstFragment.current.style.transform = 'translateY(-100%)'
        secondFragment.current.style.transform = 'translateY(-150%)'
        oldPasswordEye.current.style.display = 'inline-block'
        newPasswordEye.current.style.display = 'inline-block'
    }

    const togglePasswordButton = (field) => {
        if (passwordButtonIcon[field].type === 'eye') {
            setPasswordButtonIcon({ ...passwordButtonIcon, [field]: { icon: <FontAwesomeIcon icon={solid('eye-slash')} />, type: 'eye-slash' } })
            document.querySelector(`[name=${field}]`).type = 'text'
        } else {
            setPasswordButtonIcon({ ...passwordButtonIcon, [field]: { icon: <FontAwesomeIcon icon={solid('eye')} />, type: 'eye' } })
            document.querySelector(`[name=${field}]`).type = 'password'
        }
    }
    
    const changeImageFile = () => imageInput.current.click()

    const handleImageChange = (e) => {
        if (e?.target?.files[0]) {
            const stringArr = e.target.value.split('.')
            const valid = (stringArr[stringArr.length - 1] === 'jpg' ||
                stringArr[stringArr.length - 1] === 'png' ||
                stringArr[stringArr.length - 1] === 'jpeg' ||
                stringArr[stringArr.length - 1] === 'webp')
            if (valid) {
                setNewImageDisplay(URL.createObjectURL(e.target.files[0]))
                setNewImage(e.target.files[0])
            }
        }
    }
    async function uploadImage(file, key) {
        await Storage.put(key, file)
    }

    const updateUser = () => {
        if (!userInfo.name || !userInfo.email) return showAlert('Preencha todos os campos', true, alertsRef)

        let avatarURL = ''

        if (newImage) {
            const fileName = newImage.name.replace(/\s/g, '')
            const key = `images/${uuid()}${fileName}`
            uploadImage(newImage, key)
            avatarURL = `https://${bucket}.s3.${bucketRegion}.amazonaws.com/public/${key}`
        }

        console.log(userInfo, avatarURL)
        updateUserMutate({
            variables: {
                id: parseInt(localStorage.getItem('id')),
                name: userInfo.name,
                email: userInfo.email,
                avatar: avatarURL
            }
        })
            .then(res => {
                showAlert("Usuário atualizado", false, alertsRef)
            }).catch(error => {
                showAlert("Erro ao atualizar", true, alertsRef)
            })
    }

    const changePassword = () => {
        if(passwords.oldPassword === passwords.newPassword) return showAlert("As senhas são iguais", true, alertsRef)
        updatePasswordMutate({variables: {
            id: parseInt(localStorage.getItem('id')),
            oldPassword: passwords.oldPassword,
            newPassword: passwords.newPassword
        }}).then(res => {
            showAlert("Senha atualizada", false, alertsRef)
        }).catch(res => {
            showAlert("Erro ao atualizar", true, alertsRef)
        })
    }

    return (
        <>
            <p
                ref={alertsRef}
                className='alerts'
            />
            <section className='account-page-container'>
                <div className='main-container'>
                    <ul className='options-list'>
                        <li
                            onClick={moveToFirstFragment}
                        >
                            Detalhes
                        </li>
                        <li
                            onClick={moveToSecondFragment}
                        >
                            Senha
                        </li>
                        <li>Acesso</li>
                    </ul>
                    <div className='details-container'>
                        <div ref={firstFragment} className='fragment first-fragment'>
                            <img
                                className='avatar-img'
                                src={userInfo.avatar || newImageDisplay || defaultAvatar}
                                alt="default_avatar_image" />
                            <div className="overlay-image"
                                onClick={changeImageFile}
                            >
                                <FontAwesomeIcon icon={solid('camera')} />
                                <input
                                    ref={imageInput}
                                    type="file"
                                    alt=''
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleImageChange(e)}
                                />
                            </div>
                            <input
                                type="text"
                                name='name'
                                placeholder='Nome completo'
                                autoComplete='off'
                                value={userInfo.name || ''}
                                onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
                            />
                            <input
                                type="text"
                                name='email'
                                placeholder='Email'
                                autoComplete='off'
                                value={userInfo.email || ''}
                                onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
                            />
                            <Button
                                action="Alterar"
                                onclick={updateUser}
                            />
                        </div>
                        <div ref={secondFragment} className='fragment second-fragment'>
                            <span className='password-container'>
                                <input
                                    type="password"
                                    name='oldPassword'
                                    placeholder='Senha antiga'
                                    value={passwords.oldPassword || ''}
                                    onChange={(e) => setPasswords({ ...passwords, [e.target.name]: e.target.value })}
                                />
                                <button
                                    className='password-toggle'
                                    ref={oldPasswordEye}
                                    onClick={() => togglePasswordButton('oldPassword')}>
                                    {passwordButtonIcon.oldPassword.icon}
                                </button>
                            </span>
                            <span className='password-container'>
                                <input
                                    type="password"
                                    name='newPassword'
                                    placeholder='Nova senha'
                                    value={passwords.newPassword || ''}
                                    onChange={(e) => setPasswords({ ...passwords, [e.target.name]: e.target.value })}
                                />
                                <button
                                    className='password-toggle'
                                    ref={newPasswordEye}
                                    onClick={() => togglePasswordButton('newPassword')}>
                                    {passwordButtonIcon.newPassword.icon}
                                </button>
                            </span>
                            <Button
                                onclick={changePassword}
                                action="Alterar Senha"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}