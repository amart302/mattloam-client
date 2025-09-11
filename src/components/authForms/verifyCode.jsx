"use client";

import styles from "./authForms.module.scss";
import axios from "axios";
import errorHandler from "@/utils/errorHandler";
import{ useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import{ toast } from "sonner";
import { RxCross1 } from "react-icons/rx";
import Loader from "../loader/loader";

export default function VerifyCode({ showWindow, verifiedEmail, source, openChangePasswordWindow, closeAllWindows }){
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [ timeLeft, setTimeLeft ] = useState(0);
    const [ isActive, setIsActive ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);
    const counterRef = useRef(null);

    useEffect(() =>{
        sentCode();
    }, []);

    useEffect(() =>{
        let interval = null;
        
        if(timeLeft > 0){
            interval = setInterval(() =>{
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        }else if(timeLeft === 0){
            clearInterval(interval);
            setIsActive(false);
        }

        return() => clearInterval(interval);
    }, [ timeLeft ]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (counterRef.current && !counterRef.current.contains(event.target)) {
                closeAllWindows();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ showWindow ]);

    const sentCode = async () => {
        try {
            const formData = { email: verifiedEmail };
            await axios.post("https://api.mattloam.ru/auth/sendcode", formData);
            setTimeLeft(60);
            setIsActive(true);
        } catch (error) {
            console.error(error);
            errorHandler(error);
        }
    };


    const onSubmitConfirmEmail = async (data) =>{
        try{
            setIsLoading(true);
            
            const formData = {
                email: verifiedEmail, 
                code: data.code
            };
            const response = await axios.post("https://api.mattloam.ru/auth/checkingcode", formData);
            
            if(source === "auth"){
                localStorage.setItem("token", response.data.token);
                toast.success(response.data.message);
                setTimeout(() => window.location.reload(), 600);
            }
            else{
                openChangePasswordWindow();
            }
        } catch(error){
            console.error(error);
            errorHandler(error);
        } finally {
            setIsLoading(false);
        }
    };

    return(
        <div className="parent-modal-window">
            <form className={ `${ styles["auth-form"] } ${ styles["auth-form--wide"] }` } onSubmit={ handleSubmit(onSubmitConfirmEmail) } ref={ counterRef }>
                <div className={ styles["auth-form__close-button"] } onClick={ () => closeAllWindows() }>
                    <RxCross1 size={ 26 } color="#216ba5" />
                </div>
                <span className={ `${ styles["auth-form__title"] } ${ styles["title--size-24"] }` }>Подтвердите вашу электронную почты</span>
                <p className={ styles["auth-form__text"] }>Мы отправили письмо с кодом подтверждения на <strong>{ verifiedEmail }</strong>.</p>
                <div className={ styles["auth-form__group"] }>
                    <input className={ styles["auth-form__input"] } type="tel" maxLength={ 6 } placeholder="Введите код из письма" {...register("code", { required: "Это поле обязательно для заполнения", minLength: { value: 6, message: "Код должен содержать 6 символов" }, maxLength: { value: 6, message: "Код должен содержать 6 символов" } })} />
                    { errors.code && <p className={ styles["error-message"] }>{ errors.code.message }</p> }
                </div>
                <p className={ `${ styles["auth-form__signature"] }` }>
                    { isActive ? (
                        `Отправить код повторно можно через ${ timeLeft } секунд.`
                    ) : (
                        <>
                            Не получили код? <span role="button" tabIndex={ 0 } className={ styles["auth-form__link"] } onClick={ () => sentCode() }>Отправить повторно</span>
                        </>
                    )}
                </p>
                <button className={ styles["auth-form__button"] }>
                    { isLoading ? <Loader width={ 20 } height={ 20 } /> : "Подтвердить" }
                </button>
            </form>
        </div>
    );
}