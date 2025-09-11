import RoomCardsLarge from "@/components/roomCards/roomCardLarge";

export default function Rooms(){
    return (
        <>
            <h1 className="main__container-title">Номера</h1>
            <RoomCardsLarge option="admin" />
        </>
    );
}