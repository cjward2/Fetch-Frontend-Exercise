import React from 'react'
import './Header.css';

const Header = () => {
    return (
        <div className='header'>
           <div className="header__text-box">
                <h1 className="heading-primary">
                    <span className="heading-primary--main">Dog's best friend newsletter</span>
                    <span class="heading-primary--sub">The only dog newsletter you'll ever need!</span>
                </h1>
            </div>
        </div>
    )
}

export default Header
