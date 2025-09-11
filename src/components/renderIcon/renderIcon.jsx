import { FaTv,  FaWifi, FaUtensils, FaShower, FaRegSnowflake } from "react-icons/fa";
import { MdKitchen } from "react-icons/md";
import { GiWashingMachine } from "react-icons/gi";

export default function RenderIcon({ service }){
    switch(service) {
        case "Телевизор": return <FaTv color="#F99001" size={ 20 } />;
        case "Wi-Fi": return <FaWifi color="#F99001" size={ 20 } />;
        case "Холодильник": return <MdKitchen color="#F99001" size={ 20 } />;
        case "Стиральная машина": return <GiWashingMachine color="#F99001" size={ 20 } />;
        case "Кухня": return <FaUtensils color="#F99001" size={ 20 } />;
        case "Душ": return <FaShower color="#F99001" size={ 20 } />;
        case "Кондиционер": return <FaRegSnowflake color="#F99001" size={ 20 } />;
    }
};