"use client";

import styles from "./page.module.scss";
import axios from "axios";
import errorHandler from "@/utils/errorHandler";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import RoomCardsLarge from "@/components/roomCards/roomCardLarge";
import { toast } from "sonner";
import Loader from "@/components/loader/loader";

export default function AddBooking(){
    const router = useRouter();
    const { register, handleSubmit, setError, clearErrors, formState: { errors }} = useForm();
    const [ roomId, setRoomId ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);

    useEffect(() => { register("roomId") }, []);

    const chooseRoom = (event, id) => {
        event.preventDefault();
        setRoomId(id);
        clearErrors("roomId");
    };

    const onSubmitAddBooking = async (data) => {
        if(!roomId){
            setError("roomId", { message: "Выберите номер" });
            return;
        }

        try {
            setIsLoading(true);

            const formData = {
                dateOfEntry: data.dateOfEntry,
                departureDate: data.departureDate,
                adults: data.adults,
                children: data.children,
                phoneNumber: data.phoneNumber,
                roomId
            };
            
            const token = localStorage.getItem("token");
            const response = await axios.post("https://api.mattloam.ru/bookings/admin", formData, {
                headers: {
                    Authorization: `Bearer ${ token }`
                }
            });
            toast.success(response.data.message);
            router.push("/admin/bookings");
        } catch (error) {
            console.log(error);
            errorHandler(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <h1 className="main__container-title">Добавление брони</h1>
            <form className={ styles["add-booking-form"] } encType="multipart/form-data" onSubmit={ handleSubmit(onSubmitAddBooking) }>
                <div className={ styles["add-booking-form__form-row"] }>
                    <div className={ styles["add-booking-form__form-group"] }>
                        <label className={ styles["add-booking-form__label"] }>Дата въезда</label>
                        <input className={ styles["add-booking-form__input"] } type="date" {...register("dateOfEntry", { required: "Это поле обязательно для заполнения" })} />
                        { errors.dateOfEntry && <p className={ styles["error-message"] }>{ errors.dateOfEntry.message }</p> }
                    </div>
                    <div className={ styles["add-booking-form__form-group"] }>
                        <label className={ styles["add-booking-form__label"] }>Дата выезда</label>
                        <input className={ styles["add-booking-form__input"] } type="date" {...register("departureDate", { required: "Это поле обязательно для заполнения" })} />
                        { errors.departureDate && <p className={ styles["error-message"] }>{ errors.departureDate.message }</p> }
                    </div>
                </div>
                <div className={ styles["add-booking-form__form-row"] }>
                    <div className={ styles["add-booking-form__form-group"] }>
                        <label className={ styles["add-booking-form__label"] }>Взрослые</label>
                        <input className={ styles["add-booking-form__input"] } type="number" placeholder="Количество взрослых" {...register("adults", { required: "Это поле обязательно для заполнения",  min: { value: 1, message: "Минимум 1 взрослый" }, max: { value: 10, message: "Максимум 10 гостей" } })} />
                        { errors.adults && <p className={ styles["error-message"] }>{ errors.adults.message }</p> }
                    </div>
                    <div className={ styles["add-booking-form__form-group"] }>
                        <label className={ styles["add-booking-form__label"] }>Дети</label>
                        <input className={ styles["add-booking-form__input"] } type="number" placeholder="Количество детей" {...register("children", { required: "Это поле обязательно для заполнения", max: { value: 10, message: "Максимум 10 гостей" } })} />
                        { errors.children && <p className={ styles["error-message"] }>{ errors.children.message }</p> }
                    </div>
                </div>
                <div className={ styles["add-booking-form__form-group"] }>
                    <label className={ styles["add-booking-form__label"] }>Номер телефона</label>
                    <input className={ styles["add-booking-form__input"] } type="tel" maxLength={ 12 } placeholder="Номер телефона (+7**********)" {...register("phoneNumber", { required: "Это поле обязательно для заполнения", pattern: { value: /^\+7\d{10}$/, message: "Некорректный номер телефона" }, minLength: { value: 12, message: "Номер должен содержать 12 символов" }, maxLength: { value: 12, message: "Номер должен содержать 12 символов" } })} />
                    { errors.phoneNumber && <p className={ styles["error-message"] }>{ errors.phoneNumber.message }</p>}
                </div>
                <div className={ styles["add-booking-form__form-group"] }>
                        <label className={ styles["add-booking-form__label"] }>Номер</label>
                        <RoomCardsLarge option="select" roomId={ roomId } chooseRoom={ chooseRoom } />
                </div>
                { errors.roomId && <p className={ styles["error-message"] }>{ errors.roomId.message }</p> }
                <button className={ styles["add-booking-form__submit-button"] } type="submit">
                    { isLoading ? <Loader width={ 20 } height={ 20 } /> : "Добавить бронь" }
                </button>
            </form>
        </>
    );
}