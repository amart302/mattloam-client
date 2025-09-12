"use client";

import styles from "./roomCardLarge.module.scss";
import axios from "axios";
import errorHandler from "@/utils/errorHandler";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"
import { FaUserFriends, FaBed } from "react-icons/fa";
import { toast } from "sonner";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import RenderIcon from "../renderIcon/renderIcon";

export default function RoomCardsLarge({ option, bookingParams, roomId, chooseRoom }){
    const router = useRouter();
    const [ showCards, setShowCards ] = useState(false);
    const [ rooms, setRooms ] = useState([]);

    useEffect(() => {
        if(option === "find" && bookingParams){
            findRooms();
            return;
        }
        getRooms();
    }, []);

    useEffect(() => {
        if(roomId){
            const room = rooms.find(item => item.id === roomId);
            setRooms([ room ]);
        }
    }, [ roomId ]);

    const getRooms = async () => {
        try {
            const response = await axios.get("https://api.mattloam.ru/rooms");
            
            if(response.data.rooms.length){
                setRooms(response.data.rooms);
                setShowCards(true);
            } else setShowCards(false);
        } catch (error) {
            console.error(error);
            if(option === "admin") errorHandler(error);
            setShowCards(false);
        }
    };

    const findRooms = async () => {
        try {
            const { dateOfEntry, departureDate, adults, children } = bookingParams;
            const response = await axios.get("https://api.mattloam.ru/rooms/find", {
                params: {
                    dateOfEntry,
                    departureDate,
                    adults,
                    children
                }
            });
            setRooms(response.data.rooms);
            if(response.data.rooms.length) return setShowCards(true);
        } catch (error) {
            console.error(error);
            errorHandler(error);
        }
    };

    const booking = async (event, roomId) => {
        event.preventDefault();

        try {
            const { dateOfEntry, departureDate, adults, children } = bookingParams;
            const formData = {
                roomId: roomId,
                dateOfEntry: format(dateOfEntry, "yyyy-MM-dd"),
                departureDate: format(departureDate, "yyyy-MM-dd"),
                adults: adults,
                children: children
            };
            const token = localStorage.getItem("token");
            const response = await axios.post("https://api.mattloam.ru/bookings/", formData, {
                headers: {
                    Authorization: `Bearer ${ token }`
                }
            });
            toast.success(response.data.message);
        } catch (error) {
            console.error(error);
            errorHandler(error);
        }
    };
    
    const editRoom = (event, id) => {
        event.preventDefault();
        router.push(`/admin/editroom/${ id }`);
    };

    const deleteRoom = async (event, id) => {
        event.preventDefault();
        
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(`https://api.mattloam.ru/rooms/${ id }`, {
                headers: {
                    Authorization: `Bearer ${ token }`
                }
            });

            toast.success(response.data.message);
            getRooms();
        } catch (error) {
            console.error(error);
            errorHandler(error);
        }
    };

    if(!showCards){
        return (
           <div className={ styles["room-cards"] }>
                {
                    !showCards && [ ...Array(3) ].map((_, index) => (
                        <div className={ styles["room-card-skeleton"] } key={ index }>
                            <div>
                                <Skeleton height={ 300 } borderRadius={ 8 } />
                            </div>
                            <div className={ styles["room-card-skeleton__content"] }>
                                <Skeleton height={ 24 } borderRadius={ 4 } />
                                <Skeleton height={ 24 } width="60%" borderRadius={ 4 } />
                                <Skeleton height={ 24 } width="80%" borderRadius={ 4 } />
                            </div>
                        </div>
                    ))
                }
            </div> 
        );
    }

    return(
        <div className={ styles["room-cards"] }>
            {
                rooms.map((item, index) => (
                    <Link className={ styles["room-card-link"] } href={ `/rooms/${ item.id }` } key={ index }>
                        <div className={ styles["room-card"] }>
                            <Image className={ styles["room-card__image"] } src={ `https://api.mattloam.ru/media/${ item.mainImage }` } alt="room image" width={ 504 } height={ 306 } />
                            <div className={ styles["room-card__content"] }>
                                <p className={ styles["room-card__title"] }>{ item.title }</p>
                                <p className={ styles["room-card__description"] }>{ item.description }</p>
                                <div className={ styles["room-card__details"] }>
                                    <div className={ `${ styles["room-card__detail"] } ${ styles["room-card__text"] }` }>
                                        <FaUserFriends color="#F99001" size={ 20 } />
                                        { item.guests }
                                    </div>
                                    <div className={ `${ styles["room-card__detail"] } ${ styles["room-card__text"] }` }>
                                        <FaBed color="#F99001" size={ 20 } />
                                        { item.beds }                                                
                                    </div>
                                </div>
                                <div className={ styles["room-card__details"] }>
                                    {
                                        item?.services.slice(0, 4).map((service, index) => (
                                            <div className={ styles["room-card__detail"] } key={ index }>
                                                <RenderIcon service={ service } />
                                                <span className={ styles["room-card__text"] }>{ service }</span>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className={ styles["room-card__footer"] }>
                                    <span className={ styles["room-card__text"] }><span className={ styles["room-card__price"] }>от { item.priceFrom }</span> в сутки</span>
                                    { 
                                        option === "admin" ?
                                        <div className={ styles["room-card__actions"] }>
                                            <button className={ styles["room-card__button"] } onClick={ (event) => editRoom(event, item.id) }>Изменить</button>
                                            <button className={ `${ styles["room-card__button"] } ${ styles["room-card__delete-button"] }` } onClick={ (event) => deleteRoom(event, item.id) }>Удалить</button>
                                        </div> :
                                        option === "details" ? <button className={ styles["room-card__button"] }>Подробнее</button> :
                                        option === "find" ? <button className={ styles["room-card__button"] } onClick={(event) => booking(event, item.id)}>Забронировать</button> :
                                        option === "select" && !roomId ? <button className={ styles["room-card__button"] } onClick={(event) => chooseRoom(event, item.id)}>Выбрать</button> : ""
                                    }
                                </div>
                            </div>
                        </div>
                    </Link>
                ))
            }
        </div>
    );
}