import styles from "./not-found.module.scss";
import Link from "next/link";

export default function NotFound(){
    return (
         <div className={ styles["not-found-parent"] }>
            <div className={ styles["not-found"] }>
                <h1 className={ styles["not-found__title"] }>404 Страница не найдена</h1>
                <p className={ styles["not-found__text"] }>
                    Извините, запрашиваемая страница не существует или была перемещена.
                </p>
                <Link href="/" className={ styles["not-found__link"] }>
                    Вернуться на главную
                </Link>
            </div>
        </div>
    );
}