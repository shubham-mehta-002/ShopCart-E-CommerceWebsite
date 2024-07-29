import { toast ,Zoom} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const successMessageToastNotificaton = (message) =>{
    return toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Zoom,
        });
}


export const errorMessageToastNotificaton = (message="Something went wrong!") =>{
    return toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Zoom,
        });
}


