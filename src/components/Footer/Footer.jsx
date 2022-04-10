import React from "react";
import './Footer.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faReact } from '@fortawesome/free-brands-svg-icons'

export default function Footer() {
    return (
        <>
            <footer className='footer'>
                <span className="made-by-container">
                    <p>Made by André Rodrigues, 2022</p>
                </span>
                <span className='spacer'>A</span>
                <span className="react-logo-footer-container">
                    <FontAwesomeIcon icon={faReact} className='react-logo' />
                </span>
                <span className='spacer'>A</span>
                <span className="git-info-container">
                    <a className='git-logo-container 'style={{ textDecoration: 'none' }} href="/#" onClick={() => window.open("https://github.com/andrerrh")}>
                        <FontAwesomeIcon icon={faGithub} className='git-logo' />
                        <p className="github-text">My GitHub Profile</p>
                    </a>
                </span>
            </footer>
        </>
    )
}