"use client";

import styles from "./page.module.scss";
import axios from "axios";
import errorHandler from "@/utils/errorHandler";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TbCalendarSad } from "react-icons/tb";
import Link from "next/link";
import Image from "next/image";
import Loader from "@/components/loader/loader";
import { toast } from "sonner";

export default function Profile() {
  const router = useRouter();
  const [ user, setUser ] = useState(null);
  const [ bookings, setBookings ] = useState([]);
  const [ showCards, setShowCards ] = useState(false);

  useEffect(() => {
    getUserData();
    getUserBookings();
  }, []);

  const getUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://api.mattloam.ru/users/profile", {
          headers: {
              Authorization: `Bearer ${ token }`
          }
      });
      if(response.data.user.role === "admin"){
        router.replace("/");
        return;
      }     

      setUser(response.data.user);
    } catch (error) {
      console.error(error);
      router.replace("/");
    }
  };

  const getUserBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://api.mattloam.ru/users/bookings", {
          headers: {
              Authorization: `Bearer ${ token }`
          }
      });
      setBookings(response.data.bookings);

      if(response.data.bookings.length){
        setShowCards(true);
        return;
      }

      setShowCards(false);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBooking = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`https://api.mattloam.ru/bookings/user/${ id }`, {
          headers: {
              Authorization: `Bearer ${ token }`
          }
      });
      
      toast.success(response.data.message);
      getUserBookings();
    } catch (error) {
        console.error(error);
        errorHandler(error);
    }
  };

  const logOut = () => {
    localStorage.clear();
    window.location.reload();
  };

  if(!user){
    return (
      <div className="loader-parent">
          <Loader width={ 48 } height={ 48 } />
      </div>
    );
  }

  return (
    <>
      <section className="profile-section">
        <div className={ styles.main__wrapper }>
          <div className={ `main__container ${ styles.main__user }` }>
            <Image className={ styles.main__avatar } src="/assets/images/defaultAvatar.png" alt="Аватар" width={ 160 } height={ 160 } />
            <div className={ styles.main__info }>
              <div className={ styles["main__info-group"] }>
                <div className={ styles["main__info-item"] }>
                  <strong className={ styles["main__info-label"] }>Имя:</strong> <span className={ styles["main__info-text"] }>{ user?.firstname }</span>
                </div>
                <div className={ styles["main__info-item"] }>
                  <strong className={ styles["main__info-label"] }>Фамилия:</strong> <span className={ styles["main__info-text"] }>{ user?.lastname }</span>
                </div>
              </div>
              <div className={ styles["main__info-group"] }>
                <div className={ styles["main__info-item"] }>
                  <strong className={ styles["main__info-label"] }>Почта:</strong> <span className={ styles["main__info-text"] }>{ user?.email }</span>
                </div>
                <div className={ styles["main__info-item"] }>
                  <strong className={ styles["main__info-label"] }>Номер телефона:</strong> <span className={ styles["main__info-text"] }>{ user?.phoneNumber }</span>
                </div>
              </div>
              <div className={ styles["main__info-actions"] }>
                <div className={ styles.main__status }>✓ Подтвержден</div>
                <button className={ styles["main__logout-button"] } onClick={ () => logOut() }>Выйти</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bookings-section">
        <div className={ `${ styles.bookings } main__container` }>
          {
            showCards ?
            <h2 className={ `${ styles.bookings__title } ${ styles["bookings__title-indent"] }` }>Мои брони</h2> :
            <div className={ styles.bookings__empty }>
              <h2 className={ styles.bookings__title }>У вас пока нет броней</h2>
              <TbCalendarSad color="#F99001" size={ 50 } />
            </div>
          }
          <div className={ `${ styles.bookings__list } ${ bookings.length < 3 ? styles["bookings__list--3cols"] : "" }` }>
            {
              showCards && bookings.map((item, index) => (
                <div key={ item.id } className={ styles["booking-card"] }>
                  <div className="booking-card__image-container">
                    <Image className={ styles["booking-card__image"] } src={ `https://api.mattloam.ru/media/${ item.Room.mainImage }` } alt="booking image" width={ 388 } height={ 200} />
                  </div>
                  <div className={ styles["booking-card__info"] }>
                    <Link className={ styles["booking-card__room-title"] } href={ `/rooms/${item.Room.id}` } key={ index }>{ item.Room.title }</Link>
                    <p className={ styles["booking-card__info-text"] }><strong>Заезд: </strong>{ item.dateOfEntry }</p>
                    <p className={ styles["booking-card__info-text"] }><strong>Выезд: </strong>{ item.departureDate }</p>
                    <p className={ styles["booking-card__info-text"] }><strong>Гостей: </strong>
                      { item.adults } { (item.adults === 1) ? "взрослый" : "взрослых" }, 
                      { item.children } { (item.children === 1) ? "ребенок" : "детей" }
                    </p>
                    <div className={ styles["booking-card__actions"] }>
                      {
                        item.status === "active" ?
                        <div className={ `${ styles["booking-card__info-status"] } ${ styles["booking-card__info-status--active"] }` }>Активна</div> :
                        <div className={ `${ styles["booking-card__info-status"] } ${ styles["booking-card__info-status--pending"] }` }>Ожидает подтверждения</div>
                      }
                      { item.status === "pending" && <button className={ styles["booking-card__cancel-button"] } onClick={ () => deleteBooking(item.id) }>Отменить</button> }
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </section>
    </>
  )
}