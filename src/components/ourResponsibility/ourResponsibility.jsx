import styles from "./ourResponsibility.module.scss";
import Image from "next/image";

export default function OurResponsibility(){
    const responsibility = [
        {
            image: "/assets/images/freeParking.png",
            title: "Бесплатная парковка"
        },
        {
            image: "/assets/images/highSpeedInternet.png",
            title: "Скоростной интернет"
        },
        {
            image: "/assets/images/homeCooking.png",
            title: "Домашняя кухня"
        }
    ];
    return(
        <section className="our-responsibility-section">
            <div className={ `main__container ${ styles.responsibility }` }>
                <h2 className="main__container-title">ВАШ ОТДЫХ - НАША ОТВЕТСТВЕННОСТЬ</h2>
                <div className={ styles["responsibility-cards"] }>
                    {
                        responsibility.map((item, index) => (
                            <div className={ styles["responsibility-card"] } key={ index }>
                                <Image className={ styles["responsibility-card__image"] } src={ item.image } alt="responsibility" width={ 70 } height={ 70 } />
                                <span className={ styles["responsibility-card__text"] }>{ item.title }</span>
                            </div>
                        ))
                    }
                </div>
            </div>
        </section>
    );
}