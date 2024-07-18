import { useSelector } from 'react-redux';

const Profile = () => {
    const user = useSelector(state => state.auth.user);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <div className="space-y-2">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </div>
        </div>
    );
};

export default Profile;
