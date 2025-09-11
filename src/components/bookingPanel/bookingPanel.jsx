"use client";
import styles from "./bookingPanel.module.scss";
import axios from "axios";
import errorHandler from "@/utils/errorHandler";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaUserAlt } from "react-icons/fa";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import GuestCounter from "./guestsCounter";
import { addDays, addYears, format } from "date-fns";

export default function BookingPanel({ roomId = null, option, blockedDates = null }){
    const router = useRouter();
    const minDate = useMemo(() => new Date(), []);
    const maxDate = useMemo(() => addYears(new Date(), 1), [ minDate ]);
    
    const [ dateOfEntry, setDateOfEntry ] = useState(minDate);
    const [ departureDate, setDepartureDate ] = useState(addDays(minDate, 1));
    const [ showCounter, setShowCounter ] = useState(false);
    const [ adults, setAdults ] = useState(1);
    const [ children, setChildren ] = useState(0);
    const counterRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (counterRef.current && !counterRef.current.contains(event.target)) {
                setShowCounter(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ showCounter ]);

    const CustomInput = forwardRef(
        ({ value, onClick, className }, ref) => (
            <div className={ className } onClick={ onClick } ref={ ref }>
                { value }
                <FaCalendarAlt  color="#575757" size={ 18 }/>
            </div>
        ),
    );

    const decrementAdults = () => {
        if(adults > 1) setAdults(adults - 1);
    };

    const incrementAdults = () => {
        if(adults + children < 8) setAdults(adults + 1);
    };

    const decrementChildren = () => {
        if(children > 0) setChildren(children - 1);
    };

    const incrementChildren = () => {
        if(adults + children < 8) setChildren(children + 1);
    };

    const findRoom = () => {
        router.push(`/rooms/find?dateOfEntry=${ format(dateOfEntry, "yyyy-MM-dd") }&departureDate=${ format(departureDate, "yyyy-MM-dd") }&adults=${ adults }&children=${ children }`);
    };

    const booking = async () => {
        try {
            const formData = {
                roomId: roomId,
                dateOfEntry: format(dateOfEntry, "yyyy-MM-dd"),
                departureDate: format(departureDate, "yyyy-MM-dd"),
                adults,
                children
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
    
    return(
        <section className="booking-panel-section">
            <div className={ styles["booing-panel-parent"] }>
                <div className={ `${ styles["booking-panel"] } ${ option !== "find" ? styles["grid-1fr"] : "" }` }>
                    { option === "find" && <span className={ styles["booking-panel__title"] }>Бронирование номеров</span> }
                    <div className={ styles["booking-panel__inner"] }>
                        <div className={ styles["booking-panel__group"] }>
                            <label className={ styles["booking-panel__label"] } >Дата заезда</label>
                            <hr className={ styles["booking-panel__divider"] } />
                            <DatePicker
                                selected={ dateOfEntry }
                                onChange={(date) => {
                                    setDateOfEntry(date);
                                    setDepartureDate(addDays(date, 1));
                                }}
                                selectsStart
                                dateFormat="dd-MM-yyyy"
                                startDate={ dateOfEntry }
                                endDate={ departureDate }
                                minDate={ minDate }
                                maxDate={ maxDate }
                                excludeDateIntervals={ blockedDates }
                                customInput={ <CustomInput className={ styles["booking-panel__input"] } /> }
                                withPortal
                            />
                        </div>
                        <div className={ styles["booking-panel__group"] }>
                            <label className={ styles["booking-panel__label"] }>Дата выезда</label>
                            <hr className={ styles["booking-panel__divider"] }/>
                            <DatePicker
                                selected={ departureDate }
                                onChange={(date) => setDepartureDate(date)}
                                selectsEnd
                                dateFormat="dd-MM-yyyy"
                                startDate={ dateOfEntry }
                                endDate={ departureDate }
                                minDate={ dateOfEntry }
                                maxDate={ maxDate }
                                excludeDateIntervals={ blockedDates }
                                customInput={ <CustomInput className={ styles["booking-panel__input"] } /> }
                                withPortal
                            />
                        </div>
                        <div className={ styles["booking-panel__group"] }>
                            <label className={ styles["booking-panel__label"] }>Гости</label>
                            <hr className={ styles["booking-panel__divider"] }/>
                            <div className={ styles["booking-panel__guests"] } onClick={() => setShowCounter(true)}>
                                <div className={ styles["booking-panel__guests-inner"] }>
                                    <span className={ styles["booking-panel__guests-count"] }>{ adults } { (adults === 1) ? "взрослый" : "взрослых" }, </span>
                                    <span className={ styles["booking-panel__guests-count"] }>{ children } { (children === 1) ? "ребенок" : "детей" }</span>
                                </div>
                                <FaUserAlt color="#575757" size={ 18 } />
                            </div>
                            {
                                showCounter && <GuestCounter
                                    counterRef={ counterRef }
                                    adults={ adults }
                                    children={ children }
                                    decrementAdults={ decrementAdults }
                                    incrementAdults={ incrementAdults }
                                    decrementChildren={ decrementChildren }
                                    incrementChildren={ incrementChildren }
                                    setShowCounter={ setShowCounter }
                                />
                            }
                        </div>
                        { option === "find" ?
                            <button className={ styles["booking-panel__button"] } onClick={() => findRoom()}>Найти номер</button> :
                            <button className={ styles["booking-panel__button"] } onClick={() => booking()}>Забронировать</button>
                        }
                    </div>
                </div>
            </div>
        </section>
    );
}