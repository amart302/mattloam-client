"use client";
import styles from "./reviewCards.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

export default function reviewsCards(){
    const reviews = [
        {
            avatar: "https://avatars.mds.yandex.net/get-yapic/27503/0u-9/islands-retina-50",
            username: "Анна Нищенкова",
            text: "Хорошее расположение, прекрасный вид. Чистота и красота в номерах, все есть, убираются. А кухня это отдельное спасибо! Никогда не ела баранину, шашлык бомба! Всем советую! Каждый день нас баловали различными национальными блюдами, всегда спрашивали, что хотим. Остановившись здесь не пожалеете!",
            stars: 5
        },
        {
            avatar: "https://avatars.mds.yandex.net/get-yapic/59871/0o-7/islands-retina-50",
            username: "Олег",
            text: "Отличный гостевой дом, были с группой с 5 по 8 апреля, за окном +7 и дождь, а в доме жара и сухо! Комфортные номера, горячая вода, вкуснейшая кухня, беседки, мангал. Супер гостеприимные хозяева Алихан и Зина решат любые вопросы. Спасибо вам за теплоту и радушный приём!",
            stars: 5
        },
        {
            avatar: "https://avatars.mds.yandex.net/get-yapic/27274/szk8tW3TbR6TfmFOzh383s01Pwk-1/islands-retina-50",
            username: "Татьяна Леонова",
            text: "Уютный маленький guest-house, всё по-домашнему. Неподалёку есть большой гостиничный комплекс Армхи, туда можно ходить в бассейн или в ресторан для разнообразия, но проживание в Мяьт-Лоам было очень комфортным. Хозяйка доброжелательна и отзывчива ко всем просьбам, на завтрак, обед и ужин приготовит то, что заранее попросите. С внутреннего дворика панорамный вид на горы. Проблем с водой нет, кровати удобные.",
            stars: 5
        },
        {
            avatar: "https://avatars.mds.yandex.net/get-yapic/29310/6EyhangKVEgJsl4mgnQNefR7h0-1/islands-retina-50",
            username: "Ахмед",
            text: "Всегда можно снять недорогой номер,рекомендую для больших компаний которые хотят отдохнуть на природе с удобством. Есть все для этого.",
            stars: 5
        },
        {
            avatar: "https://avatars.mds.yandex.net/get-yapic/51169/0c-5/islands-retina-50",
            username: "Анна",
            text: "Отлично !! Вкусно!! Домашняя обстановка, была с группой 30 октября - 5ноября, незабываемо !! Вид на гору Столовая !! Все локации для поездок рядом !!!",
            stars: 5
        },
        {
            avatar: "https://avatars.mds.yandex.net/get-yapic/27503/G13fWJFV6zp1lOYfeAkJCyJGG4-1/islands-retina-50",
            username: "Дарья Москаленко",
            text: "Уютная гостиница. В номерах душевая, туалет, три кровати. Есть пледы, комплект постельного белья. Вид из окон шикарен 🥹 особенно во время рассвета.",
            stars: 5
        },
    ];

    return(

        <section className="reviews-section" id="reviews">
            <div className={ `main__container ${ styles.reviews }` }>
                <h2 className="main__container-title">ОТЗЫВЫ</h2>
                <div className={ styles["review-cards"] }>
                    <Swiper
                        slidesPerView={ 1 }
                        spaceBetween={ 30 }
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        modules={[ Pagination ]}
                        breakpoints={{
                            600: {
                                slidesPerView: 3,
                            },
                        }}
                    >
                        {
                            reviews.map((item, index) => (
                                <SwiperSlide className={ styles["review-slide"] } key={ index } >
                                    <div className={ styles["review-card__header"] }>
                                        <Image className={ styles["review-card__user-avatar"] } src={ item.avatar } alt="user avatar" width={ 58 } height={ 58 } />
                                        <span className={ styles["review-card__username"] }>{ item?.username }</span>
                                    </div>
                                    <div className={ styles["review-card__stars"] }>
                                        {
                                            [ ...Array(item.stars) ].map((_, index) => (
                                            <svg key={ index } xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24">
                                                <path fill="#F99001" d="m12 17.275l-4.15 2.5q-.275.175-.575.15t-.525-.2t-.35-.437t-.05-.588l1.1-4.725L3.775 10.8q-.25-.225-.312-.513t.037-.562t.3-.45t.55-.225l4.85-.425l1.875-4.45q.125-.3.388-.45t.537-.15t.537.15t.388.45l1.875 4.45l4.85.425q.35.05.55.225t.3.45t.038.563t-.313.512l-3.675 3.175l1.1 4.725q.075.325-.05.588t-.35.437t-.525.2t-.575-.15z"/>
                                            </svg>
                                            ))
                                        }
                                    </div>
                                    <p className={ styles["review-card__text"] }>{ item.text }</p>
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                </div>
            </div>
        </section>
    );
}