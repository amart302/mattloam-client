export default function OurAddress(){
    return(
        <section className="our-address-section" id="our-address">
            <div className="main__container">
                <h2 className="main__container-title">НАШ АДРЕС</h2>
                <div className="map-container">
                    <iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3A2132cf3664418391bb225c704cc9177ca7fdaa31cea43769e594cfc67f269e20&amp;source=constructor" width="100%" height="500" frameBorder="0"></iframe>
                </div>
            </div>
        </section>
    );
}