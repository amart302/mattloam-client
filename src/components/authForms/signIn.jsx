"use client";

import styles from "./authForms.module.scss";
import axios from "axios";
import errorHandler from "@/utils/errorHandler";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { RxCross1 } from "react-icons/rx";
import Loader from "../loader/loader";

export default function SignIn({ setSource, showWindow, openSignUpWindow, closeAllWindows, openVerifyCodeWindow, setVerifiedEmail, openEmailRequestWindow }){
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

    const onSubmitSignIn = async (data) => {
        try {
            setIsLoading(true);
            const response = await axios.post("http://localhost:5000/auth/signin", data);

            if(response.data.requiresEmailVerification){
                setSource("auth");
                setVerifiedEmail(data.email);
                openVerifyCodeWindow();
            }else{
                localStorage.setItem("token", response.data.token);
                toast.success(response.data.message);
                setTimeout(() => window.location.reload(), 600);
            }
        } catch (error) {
            console.error(error);
            errorHandler(error);
        } finally {
            setIsLoading(false);
        }
    };

    return(
        <div className="parent-modal-window">
            <form className={ styles["auth-form"] } onSubmit={ handleSubmit(onSubmitSignIn) } ref={ counterRef }>
                <div className={ styles["auth-form__close-button"] } onClick={ () => closeAllWindows() }>
                    <RxCross1 size={ 26 } color="#216ba5" />
                </div>
                <span className={ styles["auth-form__title"] }>Вход</span>
                <div className={ styles["auth-form__group"] }>
                    <input className={ styles["auth-form__input"] } type="text" placeholder="Электронная почта" {...register("email", { required: "Это поле обязательно для заполнения", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Некорректный формат почты" }, maxLength: { value: 100, message: "Почта не должна превышать 100 символов" } })} />
                    { errors.email && <p className={ styles["error-message"] }>{ errors.email.message }</p>}
                    <input className={ styles["auth-form__input"] } type="password" placeholder="Пароль" {...register("password", { required: "Это поле обязательно для заполнения", minLength: { value: 6, message: "Минимальная длина 6 символов" }, maxLength: { value: 100, message: "Пароль не должен превышать 100 символов" } })} />
                    { errors.password && <p className={ styles["error-message"] }>{ errors.password.message }</p> }
                </div>
                <button className={ styles["auth-form__button"] }>
                    { isLoading ? <Loader width={ 20 } height={ 20 } /> : "Войти" }
                </button>
                <div className={ styles["auth-form__signature"] }>
                    <span role="button" tabIndex={ 0 } className={ styles["auth-form__link"] } onClick={() => openEmailRequestWindow()}>Забыли пароль?</span>
                </div>
                <div className={ styles["auth-form__signature"] }>Создать аккаунт? <span role="button" tabIndex={ 0 } className={ styles["auth-form__link"] } onClick={() => {
                    reset();
                    openSignUpWindow();
                }}>Зарегистрироваться</span></div>
            </form>
        </div>
    );
}