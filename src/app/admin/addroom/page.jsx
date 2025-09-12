"use client";

import styles from "./page.module.scss";
import axios from "axios";
import errorHandler from "@/utils/errorHandler";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { RxCross1 } from "react-icons/rx";
import { toast } from "sonner";
import Loader from "@/components/loader/loader";


export default function Addroom(){
    const router = useRouter();
    const { register, handleSubmit, watch, setValue, setError, clearErrors, formState: { errors }} = useForm();
    const [ services, setServices ] = useState([]);
    const [ pricing, setPricing ] = useState([]);
    const [ files, setFiles ] = useState([]);
    const [ filesPreviews, setFilesPreviews ] = useState([]);
    const selectedService = watch("services");
    const selectedDateFrom = watch("dateFrom");
    const selectedDateBefore = watch("dateBefore");
    const selectedPrice = watch("price");
    const [ isLoading, setIsLoading ] = useState(false);

    const addService = () => {
        if(!selectedService){
            setError("services", { message: "Это поле обязательно для заполнения" });
            return;
        }

        if(services.includes(selectedService)){
            setError("services", { message: "Это удобство уже добавлено" });
            return;
        }

        setServices([ ...services, selectedService ]);
        setValue("services", "");
        clearErrors("services");
    };

     const deleteService = (index) => {
        const newServices = [ ...services ];
        newServices.splice(index, 1);
        setServices(newServices);
     };
    
    const addPrice = () => {
        if(!selectedDateFrom || !selectedDateBefore || !selectedPrice){
            if(!selectedDateFrom) setError("dateFrom", { message: "Это поле обязательно для заполнения" });
            if(!selectedDateBefore) setError("dateBefore", { message: "Это поле обязательно для заполнения" });
            if(!selectedPrice)setError("price", { message: "Это поле обязательно для заполнения" });
            return;
        }
        const data = {
            dateFrom: selectedDateFrom,
            dateBefore: selectedDateBefore,
            price: selectedPrice
        };
        
        setPricing([ ...pricing, data ]);
        setValue("dateFrom", "");
        setValue("dateBefore", "");
        setValue("price", "");
        clearErrors("dateFrom");
        clearErrors("dateBefore");
        clearErrors("price");
    };

    const deletePrice = (index) => {
        const newPricing = [ ...pricing ];
        newPricing.splice(index, 1);
        setPricing(newPricing);
    };

    const handleFileInput = (event) => {
        const input = event.target;
        const newFiles = [];
        const newFilesPreviews = [];

        const totalFilesAfterUpload = files.length + input.files.length;
        if(totalFilesAfterUpload > 5){
            setError("files", { message: "Максимальное количество файлов: 5" });
            input.value = "";
            return;
        }

        for(let item of input.files){
            if(!item.type.startsWith("image/")){
                setError("files", { message: "Разрешены только изображения" });
                return;
            }

            if(item.size > 10 * 1024 * 1024){
                setError("files", { message: "Файл слишком большой (макс. 10мб)" });
                return;
            }

            newFiles.push(item);
            const url = URL.createObjectURL(item);
            newFilesPreviews.push(url);
        }

        setFiles([ ...files, ...newFiles ]);
        setFilesPreviews([ ...filesPreviews, ...newFilesPreviews ]);
        clearErrors("files");
        input.value = "";
    }

    const deleteFile = (index) => {
        const newFiles = [ ...files ];
        const newFilesPreviews = [ ...filesPreviews ];
        newFiles.splice(index, 1);
        newFilesPreviews.splice(index, 1);
        
        setFiles(newFiles);
        setFilesPreviews(newFilesPreviews);
    };

    const onSubmitAddRoom = async (data) => {
        if(!services.length || !pricing.length || !files.length){
            if(!services.length) setError("services", { message: "Добавьте удобства" });
            if(!pricing.length) setError("dateFrom", { message: "Добавьте цены" });
            if(!files.length) setError("files", { message: "Добавьте изображения" });
            return;
        }

        try {
            setIsLoading(true);

            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("guests", data.guests);
            formData.append("beds", data.beds);
            formData.append("bedrooms", data.bedrooms);
            formData.append("floor", data.floor);
            formData.append("servicesJson", JSON.stringify(services));
            formData.append("pricingJson", JSON.stringify(pricing));
            files.forEach(item => formData.append("files", item));
            
            const token = localStorage.getItem("token");
            const response = await axios.post("https://api.mattloam.ru/rooms", formData, {
                headers: {
                    Authorization: `Bearer ${ token }`
                }
            });

            toast.success(response.data.message);
            router.push("/admin/rooms");
        } catch (error) {
            console.error(error);
            errorHandler(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <h1 className="main__container-title">Добавление номера</h1>
            <form className={ styles["add-room-form"] } encType="multipart/form-data" onSubmit={ handleSubmit(onSubmitAddRoom) }>
                <div className={ styles["add-room-form__form-group"] }>
                    <label className={ styles["add-room-form__label"] }>Название</label>
                    <input className={ styles["add-room-form__input"] } type="text" placeholder="2-х комнатный номер" {...register("title", { required: "Это поле обязательно для заполнения", maxLength: { value: 100, message: "Название не должно превышать 100 символов" } })} />
                    { errors.title && <p className={ styles["error-message"] }>{ errors.title.message }</p> }
                </div>
                <div className={ styles["add-room-form__form-group"] }>
                    <label className={ styles["add-room-form__label"] }>Описание</label>
                    <textarea className={ styles["add-room-form__textarea"] } rows="4" placeholder="Добавьте описание номера" {...register("description", { required: "Это поле обязательно для заполнения", maxLength: { value: 500, message: "Описание не должно превышать 500 символов" } })}></textarea>
                    { errors.description && <p className={ styles["error-message"] }>{ errors.description.message }</p> }
                </div>
                <div className={ styles["add-room-form__form-row"] }>
                    <div className={ styles["add-room-form__form-group"] }>
                        <label className={ styles["add-room-form__label"] }>Гости</label>
                        <input className={ styles["add-room-form__input"] } type="number" placeholder="Количество гостей" {...register("guests", { required: "Это поле обязательно для заполнения",  min: { value: 1, message: "Минимум 1 гость" }, max: { value: 10, message: "Максимум 10 гостей" } })} />
                        { errors.guests && <p className={ styles["error-message"] }>{ errors.guests.message }</p> }
                    </div>
                    <div className={ styles["add-room-form__form-group"] }>
                        <label className={ styles["add-room-form__label"] }>Кровати</label>
                        <input className={ styles["add-room-form__input"] } type="number" placeholder="Количество кроватей" {...register("beds", { required: "Это поле обязательно для заполнения",  min: { value: 1, message: "Минимум 1 кровать" }, max: { value: 10, message: "Максимум 10 кроватей" } })} />
                        { errors.beds && <p className={ styles["error-message"] }>{ errors.beds.message }</p> }
                    </div>
                </div>
                <div className={ styles["add-room-form__form-row"] }>
                    <div className={ styles["add-room-form__form-group"] }>
                        <label className={ styles["add-room-form__label"] }>Спальни</label>
                        <input className={ styles["add-room-form__input"] } type="number" placeholder="Количество спален" {...register("bedrooms", { required: "Это поле обязательно для заполнения",  min: { value: 1, message: "Минимум 1 спальня" }, max: { value: 10, message: "Максимум 10 спален" } })} />
                        { errors.bedrooms && <p className={ styles["error-message"] }>{ errors.bedrooms.message }</p> }
                    </div>
                    <div className={ styles["add-room-form__form-group"] }>
                        <label className={ styles["add-room-form__label"] }>Этаж</label>
                        <input className={ styles["add-room-form__input"] } type="number" placeholder="Этаж, на котором расположен номер" {...register("floor", { required: "Это поле обязательно для заполнения",  min: { value: 1, message: "Минимум 1 этаж" }, max: { value: 5, message: "Максимум 5 этаж" } })} />
                        { errors.floor && <p className={ styles["error-message"] }>{ errors.floor.message }</p> }
                    </div>
                </div>
                <div className={ styles["add-room-form__form-group"] }>
                    <label className={ styles["add-room-form__label"] }>Удобства</label>
                    <select className={ styles["add-room-form__select"] } {...register("services")}>
                        <option value="">Выберите удобство</option>
                        <option value="Телевизор">Телевизор</option>
                        <option value="Wi-Fi">Wi-Fi</option>
                        <option value="Холодильник">Холодильник</option>
                        <option value="Стиральная машина">Стиральная машина</option>
                        <option value="Кухня">Кухня</option>
                        <option value="Душ">Душ</option>
                        <option value="Кондиционер">Кондиционер</option>
                    </select>
                    { errors.services && <p className={ styles["error-message"] }>{ errors.services.message }</p> }
                    <div className={ styles["services-list"] }>
                        {
                            services.map((item, index) => (
                                <div className={ styles["services-item"] } key={ index }>
                                    <div className={ styles["services-item__meaning"] }>{ item }</div>
                                    <button className={ styles["add-room-form__remove-button"] } type="button" onClick={ () => deleteService(index) }>
                                        <RxCross1 size={ 14 } color="#ffffff" />
                                    </button>
                                </div>
                            ))
                        }
                    </div>
                    <button className={ styles["add-room-form__add-button"] } type="button" onClick={ () => addService() }>Добавить</button>
                </div>
                <div className={ styles["add-room-form__form-group"] }>
                    <label className={ styles["add-room-form__label"] }>Цены</label>
                    <div className={ styles["price-list"] }>
                        <div className={ styles["price-item"] }>
                            <input className={ styles["add-room-form__input"] } type="date" {...register("dateFrom")} />
                            <input className={ styles["add-room-form__input"] } type="date" {...register("dateBefore")} />
                            <input className={ styles["add-room-form__input"] } type="number" placeholder="Введите цену" {...register("price")} />
                        </div>
                        <div className={ styles["price-item"] }>
                            <p className={ styles["error-message"] }>{ errors.dateFrom && errors.dateFrom.message }</p>
                            <p className={ styles["error-message"] }>{ errors.dateBefore && errors.dateBefore.message }</p>
                            <p className={ styles["error-message"] }>{ errors.price && errors.price.message }</p>
                        </div>
                        {
                            pricing.map((item, index) => (
                                <div className={ styles["price-item"] } key={ index }>
                                    <div className={ styles["price-item__meaning"] }>{ item.dateFrom }</div>
                                    <div className={ styles["price-item__meaning"] }>{ item.dateBefore }</div>
                                    <div className={ styles["price-item__meaning"] }>{ item.price }</div>
                                    <button className={ styles["add-room-form__remove-button"] } type="button" onClick={ () => deletePrice(index) }>
                                        <RxCross1 size={ 14 } color="#ffffff" />
                                    </button>
                                </div>
                            ))
                        }
                    </div>
                    <button className={ styles["add-room-form__add-button"] } type="button" onClick={ () => addPrice() }>Добавить</button>
                </div>
                <div className={ styles["add-room-form__form-group"] }>
                    <label className={ styles["add-room-form__label"] }>Изображения</label>
                    <div className={ styles["selected-files"] }>
                        {
                            filesPreviews.map((item, index) => (
                                <div className={ styles["selected-files__item"] } key={ index }>
                                    <button className={ styles["selected-files__remove"] } type="button" onClick={ () => deleteFile(index) }>
                                        <RxCross1 size={ 14 } color="#ffffff" />
                                    </button>
                                    <Image className={ styles["selected-files__image"] } src={ item } alt="room image" width={ 388 } height={ 240 } />
                                </div>
                            ))
                        }
                        <div className={ styles["selected-files__item"] }>
                        <div className={ styles["add-room-form__file-upload"] }>
                            <label className={ styles["add-room-form__upload-label"] }>
                                <input className={ styles["add-room-form__upload-input"] } type="file" accept="image/*" multiple {...register("files")} onChange={ (event) => handleFileInput(event) }/>
                                <span>+</span>
                            </label>
                        </div>
                        </div>
                    </div>
                </div>
                { errors.files && <p className={ styles["error-message"] }>{ errors.files.message }</p> }
                <button className={ styles["add-room-form__submit-button"] } type="submit">
                    { isLoading ? <Loader width={ 20 } height={ 20 } /> : "Добавить номер" }
                </button>
            </form>
        </>
    );
}