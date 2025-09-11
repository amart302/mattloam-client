import { toast } from "sonner";

export default function errorHandler(error){
    if(error.response){
        const { data } = error.response;
        if(data.errors && data.errors.length > 0) toast.error(data.errors[0].msg);
        else if(data.message) toast.error(data.message);
        else toast.error("Произошла ошибка на сервере");
    }
    else if(error.request) toast.warning("Нет соединения с сервером. Проверьте интернет-соединение.");
    else toast.error("Произошла неизвестная ошибка");
}