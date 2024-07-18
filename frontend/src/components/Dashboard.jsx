import Feed from './Feed';
import { useSelector } from 'react-redux';

const Dashboard = () => {

    const user = useSelector(state => state.auth.user);

    if (!user) {
        return window.location.href = '/login';
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h2>
            <Feed />
        </div>
    );
};

export default Dashboard;
