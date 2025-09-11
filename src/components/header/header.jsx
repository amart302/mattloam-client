"use client";

import styles from "./header.module.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"
import Link from "next/link";
import Image from "next/image";
import SignIn from "../authForms/signIn";
import SignUp from "../authForms/signUp";
import EmailRequest from "../authForms/emailRequest";
import VerifyCode from "../authForms/verifyCode";
import ChangePassword from "../authForms/changePassword";

export default function Header(){
    const [ showWindow, setShowWindow ] = useState(null);
    const [ isMenuOpen, setIsMenuOpen ] = useState(false);
    const [ isAuth, setIsAuth ] = useState(false);
    const [ isAdmin, setIsAdmin ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ verifiedEmail, setVerifiedEmail ] = useState(null);
    const [ source, setSource ] = useState(null);
    const [ prevScrollPos, setPrevScrollPos ] = useState(0);
    const [ visible, setVisible ] = useState(true);
    const pathname = usePathname();
    const isHomePage = pathname === "/";

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            const isScrollingDown = currentScrollPos > prevScrollPos && currentScrollPos > 50;

            setVisible(!isScrollingDown);
            setPrevScrollPos(currentScrollPos);
            if(isMenuOpen) toggleMenu();
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [ prevScrollPos ]);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem("token");
            if(!token) return;
            
            const response = await axios.get("http://localhost:5000/auth/check", {
                headers: {
                    Authorization: `Bearer ${ token }`
                }
            });

            if(response.data.user.role === "admin"){
                setIsAdmin(true);
                return;
            }
            
            setIsAuth(true);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const hideHeader = () => setVisible(false);

    const openSignInWindow = () => setShowWindow("signin");
    const openSignUpWindow = () => setShowWindow("signup");
    const closeAllWindows = () => setShowWindow(null);
    const openVerifyCodeWindow = () => setShowWindow("verifyCode");
    const openEmailRequestWindow = () => setShowWindow("emailRequest");
    const openChangePasswordWindow = () => setShowWindow("changePassword");

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <>
            <header className={ `${ styles.header } ${ !isHomePage ? styles.background : "" } ${ !visible ? styles.hidden : "" } ` }>
                <div className={ styles.header__inner }>
                    <div className="brand">
                        <Link className={ styles.brand__link } href="/">
                            <Image className={ styles.brand__logo } src="/assets/images/logo.svg" alt="logo" width={ 150 } height={ 32 } /> 
                        </Link>
                    </div>
                    <nav className={ styles.header__nav }>
                        <Link className={ styles.header__link } href="/">Главная</Link>
                        <Link className={ styles.header__link } href="/rooms">Номера</Link>
                        <Link className={ styles.header__link } href={{ pathname: "/", hash: "reviews" }}>Отзывы</Link>
                        <Link className={ styles.header__link } href={{ pathname: "/", hash: "contacts" }}>Контакты</Link>
                        {
                            isLoading ? <Skeleton width={ 80 } height={ 22 } borderRadius={ 4 } baseColor="rgba(0, 0, 0, 0.1)" /> :
                            (
                                isAuth ? <Link className={styles.header__link} href="/profile">Профиль</Link> :
                                isAdmin ? <Link className={styles.header__link} href="/admin/bookings">Админ-панель</Link> :
                                <button className={styles.header__link} onClick={() => openSignInWindow()}>Войти</button>
                            )
                        }
                    </nav>
                    <button 
                        className={ `${ styles.header__burger } ${isMenuOpen ? styles["header__burger--active"] : ""}` }
                        onClick={() => toggleMenu() }
                        aria-label={ isMenuOpen ? "Закрыть меню" : "Открыть меню" }
                    >
                        <span className={ styles.burger__line }></span>
                        <span className={ styles.burger__line }></span>
                        <span className={ styles.burger__line }></span>
                    </button>
                </div>
                
                <div className={`${ styles["header__mobile-menu"] } ${isMenuOpen ? styles["header__mobile-menu--active"] : ""}`}>
                    <Link className={ styles.header__link } href="/" onClick={() => toggleMenu() }>Главная</Link>
                    <Link className={ styles.header__link } href="/rooms" onClick={() => toggleMenu() }>Номера</Link>
                    <Link className={ styles.header__link } href={{ pathname: "/", hash: "reviews" }} onClick={() => {
                        setTimeout(() => hideHeader(), 900);
                    }}>Отзывы</Link>
                    <Link className={ styles.header__link } href={{ pathname: "/", hash: "contacts" }} onClick={() => {
                        toggleMenu();
                        setTimeout(() => hideHeader(), 900);
                    }}>Контакты</Link>
                    {
                        isLoading ? <Skeleton width={ 80 } height={ 22 } borderRadius={ 4 } baseColor="rgba(0, 0, 0, 0.1)" /> :
                        (
                            isAuth ? <Link className={styles.header__link} href="/profile">Профиль</Link> :
                            isAdmin ? <Link className={styles.header__link} href="/admin/bookings">Админ-панель</Link> :
                            <button className={styles.header__link} onClick={() => openSignInWindow()}>Войти</button>
                        )
                    }
                </div>
            </header>

            { showWindow === "signin" && (
                <SignIn 
                    setSource={ setSource }    
                    showWindow={ showWindow }
                    openSignUpWindow={ openSignUpWindow }
                    closeAllWindows={ closeAllWindows }
                    openVerifyCodeWindow={ openVerifyCodeWindow }
                    openEmailRequestWindow={ openEmailRequestWindow }
                    setVerifiedEmail={ setVerifiedEmail }
                />
            )}
            { showWindow === "signup" && (
                <SignUp
                    setSource={ setSource }
                    showWindow={ showWindow }
                    openSignInWindow={ openSignInWindow }
                    closeAllWindows={ closeAllWindows }
                    openVerifyCodeWindow={ openVerifyCodeWindow }
                    setVerifiedEmail={ setVerifiedEmail }
                />
            )}

            { showWindow === "emailRequest" &&(
                <EmailRequest
                    setSource={ setSource }
                    showWindow={ showWindow }
                    openVerifyCodeWindow={ openVerifyCodeWindow }
                    setVerifiedEmail={ setVerifiedEmail }
                    closeAllWindows={ closeAllWindows }
                /> 
            )}

            { showWindow === "verifyCode" &&(
                <VerifyCode
                    showWindow={ showWindow }
                    source={ source }
                    verifiedEmail={ verifiedEmail }
                    openChangePasswordWindow={ openChangePasswordWindow }
                    closeAllWindows={ closeAllWindows }
                /> 
            )}

            { showWindow === "changePassword" &&(
                <ChangePassword
                    showWindow={ showWindow }
                    verifiedEmail={ verifiedEmail }
                    openSignInWindow={ openSignInWindow }
                    closeAllWindows={ closeAllWindows }
                /> 
            )}
        </>
    );
}