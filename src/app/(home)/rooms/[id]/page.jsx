"use client";

import styles from "./page.module.scss";
import axios from "axios";
import errorHandler from "@/utils/errorHandler";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import BookingPanel from "@/components/bookingPanel/bookingPanel";
import OurResponsibility from "@/components/ourResponsibility/ourResponsibility";
import OurAddress from "@/components/ourAddress/ourAddress";
import Contacts from "@/components/contacts/contacts";
import { FaUserFriends, FaBed, FaBuilding, FaDoorClosed } from "react-icons/fa";
import { format, parseISO, isSameMonth } from "date-fns";
import { ru } from "date-fns/locale";
import Loader from "@/components/loader/loader";
import RenderIcon from "@/components/renderIcon/renderIcon";

export default function Rooms(){
    const { id } = useParams();
    const [ room, setRoom ] = useState(null);
    const [ blockedDates, setBlockedDates ] = useState([]);

    useEffect(() => {
        getRoom();
    }, []);

    const getRoom = async () => {
        try {
            const response = await axios.get(`https://api.mattloam.ru/rooms/${ id }`);
            setRoom(response.data.room);
            setBlockedDates(parseDates(response.data.bookings));
        } catch (error) {
            console.error(error);
            errorHandler(error);
        }
    };

    const parseDates = (dates) => {
        let array = [];
        dates.map(item => {
            array.push({
                start: new Date(item.dateOfEntry),
                end: new Date(item.departureDate)
            });
        });
        
        return array;
    };

    const [ thumbsSwiper, setThumbsSwiper ] = useState(null);

    const formatDate = (dateFromStr, dateBeforeStr) => {
        const dateFrom = parseISO(dateFromStr);
        const dateBefore = parseISO(dateBeforeStr);
        
        if (isSameMonth(dateFrom, dateBefore)) {
            return `${ format(dateFrom, "d") } - ${ format(dateBefore, "d MMMM", { locale: ru }) }`;
        }

        return `${ format(dateFrom, "d MMMM", { locale: ru }) } - ${ format(dateBefore, "d MMMM", { locale: ru }) }`;
    };

    if(!room){
        return (
            <div className="loader-parent">
                <Loader width={ 48 } height={ 48 } />
            </div>
        );
    }
    
    return(
        <>
            <section className="hero-section">
                <div className="main__hero main__container">
                    <h1 className="main__container-title">{ room?.title }</h1>
                    <Swiper
                        style={{
                            "--swiper-navigation-color": "#fff",
                            "--swiper-pagination-color": "#fff",
                        }}
                        spaceBetween={ 30 }
                        navigation={ true }
                        thumbs={{ swiper: thumbsSwiper }}
                        modules={[ FreeMode, Navigation, Thumbs ]}
                        className={ styles["first-slider"] }
                    >
                        {
                            room?.files.map((item, index) => (
                                <SwiperSlide key={ index }>
                                    <Image className={ styles.slide } src={ `https://api.mattloam.ru/media/${item}` } alt="room image" width={ 1200 } height={ 600 } />
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                    <Swiper
                        onSwiper={ setThumbsSwiper }
                        spaceBetween={ 10 }
                        slidesPerView={ 3 }
                        freeMode={ true }
                        watchSlidesProgress={ true }
                        modules={[ FreeMode, Navigation, Thumbs ]}
                        className={ styles["second-slider"] }
                        breakpoints={{
                            600: {
                                slidesPerView: 4,
                            },
                        }}
                    >
                        {
                            room?.files.map((item, index) => (
                                <SwiperSlide key={ index }>
                                    <Image className={ styles.slide } src={ `https://api.mattloam.ru/media/${item}` } alt="small room image" width={ 294 } height={ 160 } />
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                </div>
            </section>
            <BookingPanel roomId={ id } blockedDates={ blockedDates } option="booking" />
            <section className="information-section">
                <div className={ styles["information-wrapper"] }>
                    <div className={ `main__container ${ styles.information }` }>
                        <div className={ styles.information__tags }>
                            <div className={ styles.information__tag }>
                                <FaUserFriends color="#F99001" size={ 20 } />
                                <span className={ styles.information__text }>{ room?.guests } гостей</span> 
                            </div>
                            <div className={ styles.information__tag }>
                                <FaBed color="#F99001" size={ 20 } />
                                <span className={ styles.information__text }>{ room?.beds } кровати</span>
                            </div>
                            <div className={ styles.information__tag }>
                                <FaDoorClosed  color="#F99001" size={ 20 } />
                                <span className={ styles.information__text }>{ room?.bedrooms } спальни</span>
                            </div>
                            <div className={ styles.information__tag }>
                                <FaBuilding color="#F99001" size={ 20 } />
                                <span className={ styles.information__text }>{ room?.floor } этаж</span>
                            </div>
                        </div>
                        <div className={ styles.information__inner }>
                            <div className={ styles.information__content }>
                                <div className="description">
                                    <h2 className={ styles.information__title }>Описание</h2>
                                    <p className={ styles.information__text }>
                                        { room?.description }
                                    </p>
                                </div>
                                <div className="prices" >
                                    <h2 className={ styles.information__title }>Цены</h2>
                                    <table className={ styles.prices__table }>
                                        <thead className={ styles.prices__thead }>
                                            <tr className={ styles["prices__head-row"] }>
                                                <th className={ styles["prices__head-cell"] }>Период</th>
                                                <th className={ styles["prices__head-cell"] }>Цена</th>
                                            </tr>
                                        </thead>
                                        <tbody className={ styles.prices__tbody }>
                                            {
                                                room?.pricing.map((item, index) => (
                                                    <tr className={ styles.prices__row } key={ index }>
                                                        <td className={ `${ styles.information__text } ${ styles.prices__cell }` }>{ formatDate(item.dateFrom, item.dateBefore) }</td>
                                                        <td className={ `${ styles.information__text } ${ styles.prices__cell }` }>{ item.price } ₽</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="services">
                                <h2 className={ styles.information__title }>Удобства</h2>
                                <div className={ styles.services__list }>
                                    {
                                        room?.services.map((item, index) => (
                                            <div className={ styles.services__item } key={ index }>
                                                <RenderIcon service={ item } />
                                                <span className={ styles.information__text }>{ item }</span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <OurResponsibility />
            <OurAddress />
            <Contacts />
        </>
    );
}