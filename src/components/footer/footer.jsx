import styles from "./footer.module.scss";
import Image from "next/image";

export default function Footer(){
    return(
        <footer className={ styles.footer }>
            <hr className={ styles.footer__divider } />
            <div className={ styles.footer__inner }>
                <div className="brand">
                    <a className={ styles.brand__link } href="/">
                        <Image className={ styles.brand__logo } src="/assets/images/logo-dark.svg" alt="logo dark" width={ 150 } height={ 32 } />
                    </a>
                </div>
                <div className={ styles["scroll-up"] }>
                    <a className={ styles["scroll-up__link"]} href="#top">
                        <span className={ styles["scroll-up__text"] }>Наверх</span>
                        <svg className={ styles["scroll-up__icon"] } xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="m12 10.8l-3.9 3.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.6-4.6q.3-.3.7-.3t.7.3l4.6 4.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"/></svg>
                    </a>
                </div>
            </div>
        </footer>
    );
}