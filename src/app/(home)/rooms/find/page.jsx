import RoomCardsLarge from "@/components/roomCards/roomCardLarge";

export default async function Find({ searchParams }){
    const { dateOfEntry, departureDate, adults, children } = await searchParams;

    const bookingParams = {
        dateOfEntry: dateOfEntry,
        departureDate: departureDate,
        adults: Number(adults),
        children: Number(children)
    };

    return(
        <section className="rooms-section">
            <div className="main__container">
                <h1 className="main__container-title">Доступные предложения</h1>
                <RoomCardsLarge bookingParams={ bookingParams } option="find" />
            </div>
        </section>
    );
}