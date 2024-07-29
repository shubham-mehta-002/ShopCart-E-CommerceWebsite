import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectLoggedInUser } from '../AuthSlice';

export const PublicRoute = ({ children }) => {
    const user = useSelector(selectLoggedInUser);
       
    if (user && user.userId) {
        return <Navigate to="/" replace={true} />;
    }

    return children;
};

