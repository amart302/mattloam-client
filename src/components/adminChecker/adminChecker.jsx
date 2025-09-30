"use client";

import styles from "./adminChecker.module.scss";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../adminSidebar/adminSidebar";
import Loader from "../loader/loader";

export default function AdminChecker({ children }){
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

    if(isLoading){
        return (
            <div className="loader-parent">
                <Loader width={ 48 } height={ 48 } />
            </div>
        );
    }

    return (
        <div className={ styles.layout }>
            <AdminSidebar />
            <div className="wrapper">
                <main className={ styles.main }>
                    { children }
                </main>
            </div>
        </div>
    );
}