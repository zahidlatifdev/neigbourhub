import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children }) => {

    const user = useSelector(state => state.auth.user);
    const token = localStorage.getItem('token');

    const isTokenValid = (token) => {
        if (!token) return false;
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
    }

    if (!user && !isTokenValid(token) || !token) {
        return <Navigate to="/login" />;
    }



    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
