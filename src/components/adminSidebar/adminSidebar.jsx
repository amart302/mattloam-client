"use client";

import styles from "./adminSidebar.module.scss";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaCalendar, FaBed, FaCalendarPlus  } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import Link from "next/link";
import Loader from "../loader/loader";

export default function AdminSidebar(){
    const router = useRouter();
    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        checkAdmin();
    }, []);

    const checkAdmin = async () => {
        try {
            const token = localStorage.getItem("token");
            if(!token){
                router.replace("/");
                return;
            }

            const response = await axios.get("https://api.mattloam.ru/auth/check", {
                headers: {
                    Authorization: `Bearer ${ token }`
                }
            });
            
            if(response.data.user.role !== "admin"){
                router.replace("/");
                return;
            }

            setIsLoading(false);
        } catch (error) {
            console.error(error);
            router.replace("/");
        }
    }

    const goToMainPage = () => router.replace("/");

    const logOut = () => {
        localStorage.clear();
        goToMainPage();
    };

    if(isLoading){
        return (
            <div className="loader-parent">
                <Loader width={ 48 } height={ 48 } />
            </div>
        );
    }

    return(
        <aside className={ styles.sidebar }>
            <nav className={ styles.sidebar__nav }>
                <Link className={ styles["sidebar__link-button"] } href="/admin/bookings">
                    <FaCalendar color="#ffffff" size={ 20 } />
                    Брони
                </Link>
                <Link className={ styles["sidebar__link-button"] }  href="/admin/rooms">
                    <FaBed color="#ffffff" size={ 20 } />
                    Номера
                </Link>
                <Link className={ styles["sidebar__link-button"] } href="/admin/addbooking">
                    <FaCalendarPlus color="#ffffff" size={ 20 } />
                    Создать бронь
                </Link>
                <Link className={ styles["sidebar__link-button"] } href="/admin/addroom">
                    <FaCirclePlus color="#ffffff" size={ 20 } />
                    Добавить номер
                </Link>
            </nav>
            <div className={ styles.sidebar__actions }>
                <button className={ styles["sidebar__back-to-home-button"] } onClick={ () => goToMainPage() }>На главную</button>
                <button className={ styles["sidebar__logout-button"] } onClick={ () => logOut() }>Выйти</button>
            </div>
        </aside>
    );
}