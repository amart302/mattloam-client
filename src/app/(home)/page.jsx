import styles from "./page.module.scss";
import Image from "next/image";
import BookingPanel from "@/components/bookingPanel/bookingPanel.jsx";
import OurResponsibility from "@/components/ourResponsibility/ourResponsibility";
import RoomCards from "@/components/roomCards/roomCards";
import ReviewCards from "@/components/reviewCards/reviewCards";
import Contacts from "@/components/contacts/contacts";
import OurAddress from "@/components/ourAddress/ourAddress";
import { FaStar } from "react-icons/fa";

export default function Home(){
    return (
        <>
            <section className="hero-section">
                <div className={ styles.main__hero }>
                    <div className={ styles.main__overlay }></div>
                    <div className={ styles["main__hero-content"] }>
                        <div className={ styles.main__stars }>
                        {
                            [ ...Array(4) ].map((_, index) => (
                                <FaStar size={ 26 } color="#ffffff"  key={ index } />
                            ))
                        }
                        </div>
                        <h1 className={ styles.main__title }>
                            Отель<br/>
                            «Маьт Лоам»
                        </h1>
                    </div>
                </div>
            </section>
            <BookingPanel option="find" />
            <section className="about-us-section">
                <div className={ `main__container ${ styles.about }` }>
                    <div className="about__content">
                        <h2 className={ `${ styles.about__title } main__container-title` }>О НАС</h2>
                        <p className={ styles.about__text }>Отель «Маьт Лоам» расположен в сердце Горной Ингушетии, на охраняемой территории с панорамным видом на Главный Кавказский хребет. 
                            Забронируйте номер в отеле с видом на горы — каждый из наших уютных номеров оснащён всем необходимым для спокойного отдыха в Джейрахском районе. 
                            Насладитесь тишиной, свежим воздухом и величественными пейзажами Ингушетии вдали от городской суеты.
                            К вашим услугам: гостиница в Горной Ингушетии с домашней кухней в уютной столовой и мангал-зоной для идеального отдыха в Джейрахском ущелье.
                        </p>
                    </div>
                    <Image className={ styles.about__image } src="/assets/images/aboutUsImage.jpeg" alt="about image" width={ 590 } height={ 332 } />
                </div>
            </section>
            <section className="rooms-section">
                <div className={ `${ styles.rooms } main__container` }>
                    <h2 className="main__container-title">НАШИ НОМЕРА</h2>
                    <RoomCards />
                </div>
            </section>
            <OurResponsibility />
            <OurAddress />
            <Contacts />
            <ReviewCards />
        </>
    );
}