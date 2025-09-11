import RoomCardsLarge from "@/components/roomCards/roomCardLarge";

export default function Rooms(){
    return(
        <section className="rooms-section">
            <div className="main__container">
                <h1 className="main__container-title">Наши номера</h1>
                <RoomCardsLarge option="details" />
            </div>
        </section>
    );
}