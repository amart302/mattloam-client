"use client";

import styles from "./roomCards.module.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"
import { FaUserFriends, FaBed } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

export default function RoomCards(){
    const [ showCards, setShowCards ] = useState(false);
    const [ rooms, setRooms ] = useState([]);
    const router = useRouter();
    
    useEffect(() => {
        getRooms();
    }, []);

    const getRooms = async () => {
        try {
            const response = await axios.get("https://api.mattloam.ru/rooms");
            
            setRooms(response.data.rooms.slice(0, 4));
            if(response.data.rooms.length) setShowCards(true);
        } catch (error) {
            console.error(error);
        }
    };

    const goToRoomsPage = () => router.push("/rooms");

    return(
        <>
                <div className={ styles["room-cards"] }>
                    {
                        !showCards && [ ...Array(4) ].map((_, index) => (
                            <div className={ styles["room-card-skeleton"] } key={ index }>
                                <Skeleton height={ 180 } borderRadius={ 8 } />
                                <div className={ styles["room-card-skeleton__content"] }>
                                    <Skeleton height={ 24 } borderRadius={ 4 } />
                                    <Skeleton height={ 18 } width="60%" borderRadius={ 4 } />
                                </div>
                            </div>
                        ))
                    }
                    {
                        showCards && rooms.map((item, index) => (
                            <Link className={ styles["room-card-link"] } href={ `/rooms/${ item.id }` } key={ index }>
                                <div className={ styles["room-card"] }>
                                    <Image className={ styles["room-card__image"] } src={ `https://api.mattloam.ru/media/${ item.mainImage }` } alt="room image" width={ 288 } height={ 182 } />
                                    <div className={ styles["room-card__content"] }>
                                        <p className={ styles["room-card__title"] }>{ item.title }</p>
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
                                        <p className={ styles["room-card__text"] }>
                                            <span className={ styles["room-card__price"] }>от { item.priceFrom }</span> в сутки
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    }
                </div>
                { showCards && <button className={ styles["rooms__show-more-button"] } onClick={ () => goToRoomsPage() }>Показать больше</button> }
        </>
    );
}