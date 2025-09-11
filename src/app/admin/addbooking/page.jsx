"use client";

import styles from "./page.module.scss";
import axios from "axios";
import errorHandler from "@/utils/errorHandler";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FaUserFriends, FaBed } from "react-icons/fa";
import RoomCardsLarge from "@/components/roomCards/roomCardLarge";
import { toast } from "sonner";
import RenderIcon from "@/components/renderIcon/renderIcon";
import Loader from "@/components/loader/loader";

export default function AddBooking(){
    const router = useRouter();
    const { register, handleSubmit, setError, clearErrors, formState: { errors }} = useForm();
    const [ room, setRoom ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);

    useEffect(() => { register("room") }, []);

    const chooseRoom = (event, room) => {
        event.preventDefault();
        setRoom(room);
    };

    const onSubmitAddBooking = async (data) => {
        if(!room){
            setError("room", { message: "Выберите номер" });
            return;
        }else clearErrors("room");

        try {
            setIsLoading(true);

            const formData = {
                dateOfEntry: data.dateOfEntry,
                departureDate: data.departureDate,
                adults: data.adults,
                children: data.children,
                phoneNumber: data.phoneNumber,
                roomId: room.id
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
                        { !room ? <RoomCardsLarge option="select" chooseRoom={ chooseRoom } /> : (
                            <div className={ styles["room-card"] }>
                                <Image className={ styles["room-card__image"] } src={ `https://api.mattloam.ru/media/${ room.mainImage }` } alt="room image" width={ 504 } height={ 306 } />
                                <div className={ styles["room-card__content"] }>
                                    <p className={ styles["room-card__title"] }>{ room.title }</p>
                                    <p className={ styles["room-card__description"] }>{ room.description }</p>
                                    <div className={ styles["room-card__details"] }>
                                        <div className={ `${ styles["room-card__detail"] } ${ styles["room-card__text"] }` }>
                                            <FaUserFriends color="#F99001" size={ 20 } />
                                            { room.guests }
                                        </div>
                                        <div className={ `${ styles["room-card__detail"] } ${ styles["room-card__text"] }` }>
                                            <FaBed color="#F99001" size={ 20 } />
                                            { room.beds }                                                
                                        </div>
                                    </div>
                                    <div className={ styles["room-card__details"] }>
                                        {
                                            room?.services.slice(0, 4).map((service, index) => (
                                                <div className={ styles["room-card__detail"] } key={ index }>
                                                    <RenderIcon service={ service } />
                                                    <span className={ styles["room-card__text"] }>{ service }</span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        ) }
                </div>
                { errors.room && <p className={ styles["error-message"] }>{ errors.room.message }</p> }
                <button className={ styles["add-booking-form__submit-button"] } type="submit">
                    { isLoading ? <Loader width={ 20 } height={ 20 } /> : "Добавить бронь" }
                </button>
            </form>
        </>
    );
}