import styles from "./contacts.module.scss";
import Link from "next/link";
import Image from "next/image";

export default function Contacts(){
    return(
        <section className="contacts-section" id="contacts">
            <div className={ `main__container ${ styles.contacts }` }>
                <h2 className={ `main__container-title ${ styles.contacts__title }` }>СВЯЗАТЬСЯ С НАМИ</h2>
                <div className={ styles.contacts__inner }>
                    <Link className={ styles.contacts__link } href="tel:+79631726622">
                        <div className={ styles.contacts__group }>
                            <div className={ `${ styles["contacts__image-container"] } ${ styles["phone-image-container"] }` }>
                                <Image src="/assets/images/phone.svg" alt="phone" className="contacts__image" width={ 24 } height={ 24 } />
                            </div>
                            <span className={ styles.contacts__text }>+7(963) 172-66-22</span>
                        </div>
                    </Link>
                    <Link className={ styles.contacts__link } href="tel:+79188125652">
                        <div className={ styles.contacts__group }>
                            <div className={ `${ styles["contacts__image-container"] } ${ styles["phone-image-container"] }` }>
                                <Image src="/assets/images/phone.svg" alt="phone" className="contacts__image" width={ 24 } height={ 24 } />
                            </div>
                            <span className={ styles.contacts__text }>+7(918) 812-56-52</span>
                        </div>
                    </Link>
                    <Link className={ styles.contacts__link } href="https://wa.me/+79631726622" target="_blank">
                        <div className={ styles.contacts__group }>
                            <div className={ `${ styles["contacts__image-container"] } ${ styles["whatsApp-image-container"] }` }>
                                <Image src="/assets/images/whatsApp.svg" alt="whatsApp" className="contacts__image" width={ 26 } height={ 26 } />
                            </div>
                            <span className={ styles.contacts__text }>В WhatsApp</span>
                        </div>
                    </Link>
                    <Link className={ styles.contacts__link } href="https://t.me/+79631726622" target="_blank">
                        <div className={ styles.contacts__group }>
                            <div className={ `${ styles["contacts__image-container"] } ${ styles["telegram-image-container"] }` }>
                                <Image src="/assets/images/telegram.svg" alt="telegram" className="contacts__image" width={ 26 } height={ 26 } />
                            </div>
                            <span className={ styles.contacts__text }>В Telegram</span>
                        </div>
                    </Link>
                                        <Link className={ styles.contacts__link } href="mailto:mattloam06@gmail.com">
                        <div className={ styles.contacts__group }>
                            <div className={ `${ styles["contacts__image-container"] } ${ styles["email-image-container"] }` }>
                                <Image src="/assets/images/email.svg" alt="email" className="contacts__image" width={ 22 } height={ 22 } />
                            </div>
                            <span className={ styles.contacts__text }>По почте</span>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}