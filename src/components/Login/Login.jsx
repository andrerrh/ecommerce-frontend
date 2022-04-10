import React, { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'

import './Login.scss'
import Button from '../common/Button'
import { CREATE_USER, LOGIN_USER } from '../../queries'

export default function Login() {

    const [passwordButtonIcon, setPasswordButtonIcon] = useState({
        login: { icon: <FontAwesomeIcon icon={solid('eye')} />, type: 'eye' },
        register: { icon: <FontAwesomeIcon icon={solid('eye')} />, type: 'eye' },
        confirmRegister: { icon: <FontAwesomeIcon icon={solid('eye')} />, type: 'eye' }
    })
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    })
    const [registerInfo, setRegisterInfo] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirmation: ''
    })

    const alertsRef = useRef(null)
    const firstFragment = useRef(null)
    const secondFragment = useRef(null)

    const [addUserMutate] = useMutation(CREATE_USER)
    const [loginUserMutate] = useMutation(LOGIN_USER)

    const navigate = useNavigate()

    const togglePasswordButton = (field) => {
        if (passwordButtonIcon[field].type === 'eye') {
            setPasswordButtonIcon({ ...passwordButtonIcon, [field]: { icon: <FontAwesomeIcon icon={solid('eye-slash')} />, type: 'eye-slash' } })
            document.querySelector(`#${field}-password`).type = 'text'
        } else {
            setPasswordButtonIcon({ ...passwordButtonIcon, [field]: { icon: <FontAwesomeIcon icon={solid('eye')} />, type: 'eye' } })
            document.querySelector(`#${field}-password`).type = 'password'
        }
    }

    const moveToRegisterFragment = () => {
        firstFragment.current.style.transform = 'translateX(-100%)'
        secondFragment.current.style.transform = 'translateX(0%)'
    }

    const moveToLoginFragment = () => {
        firstFragment.current.style.transform = 'translateX(0%)'
        secondFragment.current.style.transform = 'translateX(100%)'
    }

    const showAlert = (text, error) => {
        alertsRef.current.style.transform = 'translateX(-50%) translateY(0%)'
        alertsRef.current.style.visibility = 'visible'
        alertsRef.current.style.opacity = '1'

        if (!error) {
            alertsRef.current.style.border = '2px solid rgb(0,255,0)'
            alertsRef.current.style.color = 'rgb(0, 255, 0)'
        } else {
            alertsRef.current.style.border = '2px solid rgb(255,0,0)'
            alertsRef.current.style.color = 'rgb(255,0,0)'
        }

        setTimeout(() => {
            alertsRef.current.style.transform = 'translateX(-50%) translateY(-100%)'
            alertsRef.current.style.visibility = 'hidden'
            alertsRef.current.style.opacity = '0'
        }, 2000)

        alertsRef.current.innerHTML = text
    }

    const registerUser = () => {
        if (!registerInfo.username || !registerInfo.email || !registerInfo.password || !registerInfo.passwordConfirmation) {
            return showAlert("Prencha todos os campos", true)
        }
        if (registerInfo.password !== registerInfo.passwordConfirmation) {
            return showAlert("Os campos de senha não conferem", true)
        }
        if (!registerInfo.email.includes('.') || !registerInfo.email.includes('@')) {
            return showAlert("Email inválido", true)
        }

        addUserMutate({
            variables: {
                name: registerInfo.username,
                email: registerInfo.email,
                password: registerInfo.password
            }
        })
            .then(res => {
                showAlert("Usuário registrado!", false)
                setRegisterInfo({
                    name: '',
                    email: '',
                    password: '',
                    passwordConfirmation: ''
                })
                moveToLoginFragment()
            })
            .catch(err => showAlert("Falha ao registrar", true))
    }

    const loginUser = () => {
        if (!loginInfo.email || !loginInfo.password) {
            return showAlert("Email e/ou senha inválidos", true)
        }

        loginUserMutate({
            variables: {
                email: loginInfo.email,
                password: loginInfo.password
            }
        })
            .then(res => {
                if (!res.data.loginUser.token) throw showAlert("Erro ao logar", true)
                localStorage.setItem('id', res.data.loginUser.id)
                localStorage.setItem('token', res.data.loginUser.token)
                showAlert("Login efetuado", false)
                navigate('/')
            })
            .catch(res => {
                showAlert("Erro ao logar", true)
            })
    }

    return (
        <>
            <p
                ref={alertsRef}
                className='alerts'
            />
            <div className="login-page-container">
                <div
                    className='first-fragment'
                    ref={firstFragment}
                >
                    <div className="login-fragment">
                        <h2>Login do cliente</h2>
                        <input
                            placeholder='Email'
                            type="text"
                            name="email"
                            id="login-email"
                            value={loginInfo.email || ''}
                            onChange={(e) => setLoginInfo({ ...loginInfo, [e.target.name]: e.target.value })}
                        />
                        <span className='password-container'>
                            <input
                                placeholder='Senha'
                                type="password"
                                name="password"
                                id="login-password"
                                value={loginInfo.password || ''}
                                onChange={(e) => setLoginInfo({ ...loginInfo, [e.target.name]: e.target.value })}
                            />
                            <button
                                className='password-toggle'
                                onClick={() => togglePasswordButton('login')}>
                                {passwordButtonIcon.login.icon}
                            </button>
                        </span>
                        <Button
                            onclick={loginUser}
                            action="Entrar"
                        />
                        <Button
                            onclick={moveToRegisterFragment}
                            action="Registrar"
                        />
                    </div>
                </div>
                <div
                    className='second-fragment'
                    ref={secondFragment}
                >
                    <div className="register-fragment">
                        <button
                            className='left-arrow'
                            onClick={moveToLoginFragment}
                        >
                            <FontAwesomeIcon icon={solid('angle-left')} />
                        </button>
                        <h2>Cadastro de cliente</h2>
                        <input
                            placeholder='Nome completo'
                            type="text"
                            name="username"
                            id="register-username"
                            value={registerInfo.username || ''}
                            onChange={(e) => setRegisterInfo({ ...registerInfo, [e.target.name]: e.target.value })}
                        />
                        <input
                            placeholder='Email'
                            type='email'
                            name="email"
                            id="register-email"
                            value={registerInfo.email || ''}
                            onChange={(e) => setRegisterInfo({ ...registerInfo, [e.target.name]: e.target.value })}
                        />
                        <span className='password-container'>
                            <input
                                placeholder='Senha'
                                type="password"
                                name="password"
                                id="register-password"
                                value={registerInfo.password || ''}
                                onChange={(e) => setRegisterInfo({ ...registerInfo, [e.target.name]: e.target.value })}
                            />
                            <button
                                className='password-toggle'
                                onClick={() => togglePasswordButton('register')}>
                                {passwordButtonIcon.register.icon}
                            </button>
                            <input
                                placeholder='Confirmar senha'
                                type="password"
                                name="passwordConfirmation"
                                value={registerInfo.passwordConfirmation || ''}
                                onChange={(e) => setRegisterInfo({ ...registerInfo, [e.target.name]: e.target.value })}
                                id="confirmRegister-password" />
                            <button
                                className='password-toggle'
                                onClick={() => togglePasswordButton('confirmRegister')}>
                                {passwordButtonIcon.confirmRegister.icon}
                            </button>
                        </span>
                        <Button
                            onclick={registerUser}
                            action="Concluir registro"
                        />
                    </div>
                </div>
            </div>
        </>
    )
}