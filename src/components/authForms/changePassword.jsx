"use client";

import styles from "./authForms.module.scss";
import axios from "axios";
import errorHandler from "@/utils/errorHandler";
import{ toast } from "sonner";
import { useForm } from "react-hook-form";
import Loader from "../loader/loader";
import { useEffect, useRef, useState } from "react";
import { RxCross1 } from "react-icons/rx";

export default function ChangePassword({ showWindow, verifiedEmail, openSignInWindow, closeAllWindows }){
    const { register, handleSubmit, formState: { errors } } = useForm();
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

    const onSubmitChangePassword = async (data) => {
        if(data.password !== data.confirmPassword){
            toast.error("Пароли не совпадают");
            return;
        }

        try {    
            setIsLoading(true);

            const formData = {
                email: verifiedEmail,
                password: data.password
            };
            const response = await axios.post("http://localhost:5000/auth/changepassword", formData);
            toast.success(response.data.message);
            openSignInWindow();
        } catch (error) {
            console.error(error);
            errorHandler(error);
        } finally {
            setIsLoading(false);
        }
    };

    return(
        <div className="parent-modal-window">
            <form className={ `${ styles["auth-form"] } ${ styles["auth-form--wide"] }` } onSubmit={ handleSubmit(onSubmitChangePassword) } ref={ counterRef }>
                <div className={ styles["auth-form__close-button"] } onClick={ () => closeAllWindows() }>
                    <RxCross1 size={ 26 } color="#216ba5" />
                </div>
                <span className={ `${ styles["auth-form__title"] } ${ styles["title--size-24"] }` }>Введите новый пароль</span>
                <p className={ styles["auth-form__text"] }>Используйте буквы, цифры и спецсимволы для надежности</p>
                <div className={ styles["auth-form__group"] }>
                    <input className={ styles["auth-form__input"] } type="password" placeholder="Пароль" {...register("password", { required: "Это поле обязательно для заполнения", minLength: { value: 6, message: "Минимальная длина 6 символов" }, maxLength: { value: 255, message: "Слишком длинный пароль" } })} />
                    { errors.password && <p className="error-message">{ errors.password.message }</p> }
                    <input className={ styles["auth-form__input"] } type="password" placeholder="Подтвердите пароль" {...register("confirmPassword", { required: "Это поле обязательно для заполнения", minLength: { value: 6, message: "Минимальная длина 6 символов" }, maxLength: { value: 255, message: "Слишком длинный пароль" } })} />
                    { errors.confirmPassword && <p className="error-message">{ errors.confirmPassword.message }</p> }
                </div>
                <button className={ styles["auth-form__button"] }>
                    { isLoading ? <Loader width={ 20 } height={ 20 } /> : "Сохранить пароль" }
                </button>
            </form>
        </div>
    );
}