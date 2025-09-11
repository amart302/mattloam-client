import styles from "./bookingPanel.module.scss";

export default function GuestCounter({ counterRef, adults, children, decrementAdults, incrementAdults, decrementChildren, incrementChildren, setShowCounter }){
    return(
        <div className="parent-modal-window">
            <div className={ styles["guest-counter"] } ref={ counterRef }>
                <span className={ styles["guest-counter__title"] }>Количество гостей</span>
                <hr className={ styles["guest-counter__divider"] } />
                <div className={ styles["guest-counter__inner"] }>
                    <div className={ styles["guest-counter__group"] }>
                        <label className={ styles["guest-counter__label"] }>Взрослые</label>
                        <div className={ styles["guest-counter__controls"] }>
                            <button className={ styles["guest-counter__button"] } onClick={() => decrementAdults()} disabled={ (adults === 1) ? true : false }>-</button>
                            <span className={ styles["guest-counter__guests-count"] }>{ adults }</span>
                            <button className={ styles["guest-counter__button"] } onClick={() => incrementAdults()} disabled={ (adults + children >= 8) ? true : false }>+</button>
                        </div>
                    </div>
                    <div className="guest-counter__group">
                        <label className={ styles["guest-counter__label"] }>Дети</label>
                        <div className={ styles["guest-counter__controls"] }>
                            <button className={ styles["guest-counter__button"] } onClick={() => decrementChildren()} disabled={ (children === 0) ? true : false }>-</button>
                            <span className={ styles["guest-counter__guests-count"] }>{ children }</span>
                            <button className={ styles["guest-counter__button"] } onClick={() => incrementChildren()} disabled={ (adults + children >= 8) ? true : false }>+</button>
                        </div>
                    </div>
                </div>
                <button className={ styles["guest-counter__done-button"] } onClick={() => setShowCounter(false)}>Готово</button>
            </div>
        </div>
    );
}