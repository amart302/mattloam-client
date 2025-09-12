import styles from "./footer.module.scss";
import Link from "next/link";
import Image from "next/image";
import { FaChevronUp } from "react-icons/fa";

export default function Footer(){
    return(
        <footer className={ styles.footer }>
            <hr className={ styles.footer__divider } />
            <div className={ styles.footer__inner }>
                <div className="brand">
                    <Link className={ styles.brand__link } href="/">
                        <Image className={ styles.brand__logo } src="/assets/images/logo-dark.svg" alt="logo dark" width={ 150 } height={ 32 } />
                    </Link>
                </div>
                <div className="scroll-up">
                    <Link className={ styles["scroll-up__link"]} href="#top">
                        <span className={ styles["scroll-up__text"] }>Наверх</span>
                        <FaChevronUp size={ 20 } color="#000000" />
                    </Link>
                </div>
            </div>
        </footer>
    );
}