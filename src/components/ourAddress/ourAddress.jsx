export default function OurAddress(){
    return(
        <section className="our-address-section" id="our-address">
            <div className="main__container">
                <h2 className="main__container-title">НАШ АДРЕС</h2>
                <div className="map-container">
                    <iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3A260eed69fa350af9093782a47d4471b58c84c7632eb9c3aae4dd198f6e76e6d7&amp;source=constructor" width="100%" height="500" frameBorder="0"></iframe>
                </div>
            </div>
        </section>
    );
}