"use client";

import styles from "./authForms.module.scss";
import axios from "axios";
import errorHandler from "@/utils/errorHandler";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { RxCross1 } from "react-icons/rx";
import Loader from "../loader/loader";

export default function SignIn({ setSource, showWindow, openSignInWindow, closeAllWindows, openVerifyCodeWindow, setVerifiedEmail }){
    const { register, handleSubmit, reset, formState: { errors }} = useForm();
    const [ isLoading, setIsLoading ] = useState(false);
    const counterRef = useRef(null);
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (counterRef.current && !counterRef.current.contains(event.target)) {
                closeAllWindows();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ showWindow ]);

    const onSubmitSignUp = async (data) => {
        try {
            setIsLoading(true);
            await axios.post("https://api.mattloam.ru/auth/signup", data);
            setSource("auth");
            setVerifiedEmail(data.email);
            openVerifyCodeWindow();
        } catch (error) {
            console.error(error);
            errorHandler(error);
        } finally {
            setIsLoading(false);
        }
    };
    

    return(
        <div className="parent-modal-window">
            <form className={ `${ styles["auth-form"] } ${ styles["auth-form--wide"] }` } onSubmit={ handleSubmit(onSubmitSignUp) } ref={ counterRef }>
                <div className={ styles["auth-form__close-button"] } onClick={ () => closeAllWindows() }>
                    <RxCross1 size={ 26 } color="#216ba5" />
                </div>
                <span className={ styles["auth-form__title"] }>Регистрация</span>
                <div className={ styles["auth-form__group"] }>
                    <div className={ styles["auth-form__wrapper"] }>
                        <div className={ styles["auth-form__group"] }>
                            <input className={ styles["auth-form__input"] } type="text" placeholder="Имя" {...register("firstname", { required: "Это поле обязательно для заполнения", maxLength: { value: 100, message: "Имя не должно превышать 100 символов" } })} />
                            { errors.firstname && <p className={ styles["error-message"] }>{ errors.firstname.message }</p>}
                        </div>
                        <div className={ styles["auth-form__group"] }>
                            <input className={ styles["auth-form__input"] } type="text" placeholder="Фамилия" {...register("lastname", { required: "Это поле обязательно для заполнения", maxLength: { value: 100, message: "Фамилия не должна превышать 100 символов" } })} />
                            { errors.lastname && <p className={ styles["error-message"] }>{ errors.lastname.message }</p>}
                        </div>
                    </div>
                    <input className={ styles["auth-form__input"] } type="tel" maxLength={ 12 } placeholder="Номер телефона (+7**********)" {...register("phoneNumber", { required: "Это поле обязательно для заполнения", pattern: { value: /^\+7\d{10}$/, message: "Некорректный номер телефона" }, minLength: { value: 12, message: "Номер должен содержать 12 символов" }, maxLength: { value: 12, message: "Номер должен содержать 12 символов" } })} />
                    { errors.phoneNumber && <p className={ styles["error-message"] }>{ errors.phoneNumber.message }</p>}
                    <input className={ styles["auth-form__input"] } type="text" placeholder="Электронная почта" {...register("email", { required: "Это поле обязательно для заполнения", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Некорректный формат почты" }, maxLength: { value: 100, message: "Почта не должна превышать 100 символов" } })} />
                    { errors.email && <p className={ styles["error-message"] }>{ errors.email.message }</p>}
                    <input className={ styles["auth-form__input"] } type="password" placeholder="Пароль" {...register("password", { required: "Это поле обязательно для заполнения", minLength: { value: 6, message: "Минимальная длина 6 символов" }, maxLength: { value: 100, message: "Пароль не должен превышать 100 символов" } })} />
                    { errors.password && <p className={ styles["error-message"] }>{ errors.password.message }</p> }
                </div>
                <button className={ styles["auth-form__button"] }>
                    { isLoading ? <Loader width={ 20 } height={ 20 } /> : "Зарегистрироваться" }
                </button>
                <div className={ styles["auth-form__signature"] }>У вас есть аккаунт? <span role="button" tabIndex={ 0 } className={ styles["auth-form__link"] } onClick={() => {
                    reset();
                    openSignInWindow();
                }}>Войти</span></div>
            </form>
        </div>
    );
}