"use client";

import styles from "./authForms.module.scss";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { RxCross1 } from "react-icons/rx";

export default function EmailRequest({ showWindow, setVerifiedEmail, openVerifyCodeWindow, setSource, closeAllWindows }){
    const { register, handleSubmit, formState: { errors } } = useForm();
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
    
    const onSubmitEmailRequest = (data) => {
        setSource("passwordRecovery");
        setVerifiedEmail(data.email);
        openVerifyCodeWindow();
    };

    return(
        <div className="parent-modal-window">
            <form className={ `${ styles["auth-form"] } ${ styles["auth-form--wide"] }` } onSubmit={ handleSubmit(onSubmitEmailRequest) } ref={ counterRef }>
                <div className={ styles["auth-form__close-button"] } onClick={ () => closeAllWindows() }>
                    <RxCross1 size={ 26 } color="#216ba5" />
                </div>
                <span className={ `${ styles["auth-form__title"] } ${ styles["title--size-24"] }` }>Введите ваш email</span>
                <p className={ styles["auth-form__text"] }>На этот адрес будет отправлен код подтверждения.</p>
                <div className={ styles["auth-form__group"] }>
                    <input className={ styles["auth-form__input"] } type="text" placeholder="Электронная почта" {...register("email", { required: "Это поле обязательно для заполнения", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Некорректный формат почты" }, maxLength: { value: 100, message: "Почта не должна превышать 100 символов" } })} />
                    { errors.email && <p className={ styles["error-message"] }>{ errors.email.message }</p>}
                </div>
                <button className={ styles["auth-form__button"] }>Отправить код</button>
            </form> 
        </div>
    );
}