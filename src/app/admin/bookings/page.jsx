"use client";

import styles from "./page.module.scss";
import axios from "axios";
import errorHandler from "@/utils/errorHandler";
import { useEffect, useState } from "react";
import { format, parseISO, isSameMonth } from "date-fns";
import { ru } from "date-fns/locale";
import Link from "next/link";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"
import { toast } from "sonner";

export default function Bookings(){
    const [ showCards, setShowCards ] = useState(false);
    const [ status, setStatus ] = useState("active");
    const [ bookings, setBookings ] = useState([]);

    useEffect(() => {
        getBookings();
    }, [ status ]);
    
    const getBookings = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`https://api.mattloam.ru/bookings`, {
                params: {
                    status
                },
                headers: {
                    Authorization: `Bearer ${ token }`
                }
            });
            
            if(response.data.bookings.length){
                setBookings(response.data.bookings);
                setShowCards(true);
            }
        } catch (error) {
            console.error(error);
            errorHandler(error);
            setShowCards(false);
        }
    };

    const confirmBooking = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.patch(`https://api.mattloam.ru/bookings/confirm/${ id }`, null, {
                headers: {
                    Authorization: `Bearer ${ token }`
                }
            });

            toast.success(response.data.message);
            getBookings();
        } catch (error) {
            console.error(error);
            errorHandler(error);
        }
    };

    const deleteBooking = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(`https://api.mattloam.ru/bookings/admin/${ id }`, {
                headers: {
                    Authorization: `Bearer ${ token }`
                }
            });
            
            toast.success(response.data.message);
            getBookings();
        } catch (error) {
            console.error(error);
            errorHandler(error);
        }
    };

    const formatDate = (dateFromStr, dateBeforeStr) => {
        const dateFrom = parseISO(dateFromStr);
        const dateBefore = parseISO(dateBeforeStr);
        
        if (isSameMonth(dateFrom, dateBefore)) {
            return `${ format(dateFrom, "d") } - ${ format(dateBefore, "d MMMM", { locale: ru }) }`;
        }

        return `${ format(dateFrom, "d MMMM", { locale: ru }) } - ${ format(dateBefore, "d MMMM", { locale: ru }) }`;
    };

    const getActiveBookings = () => setStatus("active");
    const getPendingBookings = () => setStatus("pending");

    return (
        <div className={ styles.bookings }>
            <h1 className="main__container-title">Брони</h1>
            <div className={ styles.bookings__actions }>
                <button className={ `${ styles["bookings__action-button"] } ${ status === "active" ? styles["bookings__action-button--active"] : styles["bookings__action-button--disabled"] }` } onClick={ () => getActiveBookings() }>Активные</button>
                <button className={ `${ styles["bookings__action-button"] } ${ status === "pending" ? styles["bookings__action-button--active"] : styles["bookings__action-button--disabled"] }` } onClick={ () => getPendingBookings() }>Не подтвержденные</button>
            </div>
            {
                <div className={ styles["bookings-cards"] }>
                    {
                        !showCards && [ ...Array(4) ].map((_, index) => (
                            <div className={ styles["booking-card-skeleton"] } key={ index } style={{ boxShadow: "none" }}>
                                <Skeleton height={ 100 } borderRadius={ 8 } />
                                <div className={ styles["booking-card-skeleton__content"] }>
                                    <div className={ styles["booking-card__content-wrapper"] }>
                                        <Skeleton height={ 18 } borderRadius={ 4 } />
                                        <Skeleton height={ 18 } borderRadius={ 4 } />
                                    </div>
                                    <Skeleton height={ 24 } borderRadius={ 4 } />
                                    <Skeleton height={ 24 } borderRadius={ 4 } />
                                </div>
                            </div>
                        ))
                    }
                    {
                        showCards && bookings.map(item => (
                            <div className={ styles["booking-card"] } key={ item.id }>
                                <Image className={ styles["booking-card__image"] } src={ `https://api.mattloam.ru/media/${ item.Room.mainImage }` } alt="room image" width={ 180 } height={ 110 } />
                                <div className={ styles["booking-card__content"] }>
                                    <div className={ styles["booking-card__content-wrapper"] }>
                                        <Link className={ styles["booking-card__room-title"] } href={ `/rooms/${ item.roomId }` }>{ item.Room.title }</Link>
                                        <span className={ styles["booking-card__text"] }>{ formatDate(item.dateOfEntry, item.departureDate) }</span>
                                    </div>
                                    <div className={ styles["booking-card__content-wrapper"] }>
                                        {
                                            item.phoneNumber ?
                                            <span className={ styles["booking-card__text"] }>{ item.phoneNumber }</span> :
                                            <>
                                                <span className={ styles["booking-card__text"] }>{ item.User.email }</span>
                                                <span className={ styles["booking-card__text"] }>{ item.User.phoneNumber }</span>
                                            </>
                                        }
                                    </div>
                                    {
                                        item.status === "active" ?
                                        <div className={ `${ styles["booking-card__status"] } ${ styles["booking-card__status--active"] }` }>Активна</div> :
                                        <div className={ `${ styles["booking-card__status"] } ${ styles["booking-card__status--pending"] }` }>Ожидает подтверждения</div>
                                    }
                                    { item.status === "pending" && <button className={ styles["booking-card__confirm-button"] } onClick={ () => confirmBooking(item.id) }>Подтвердить бронь</button> }
                                    <button className={ styles["booking-card__cancel-button"] } onClick={ () => deleteBooking(item.id) }>Отменить бронь</button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            }
        </div>
    );
}