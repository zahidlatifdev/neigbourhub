import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/app/features/auth/authSlice';

const Header = () => {
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    return (
        <header className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <nav>

                    {
                        user ?
                            <>
                                <Button variant="link" asChild>
                                    <Link to="/">Dashboard</Link>
                                </Button>
                                <Button variant="link" asChild>
                                    <Link to="/events">Events</Link>
                                </Button>
                                <Button variant="link" asChild>
                                    <Link to="/profile">Profile</Link>
                                </Button>
                                <Button onClick={() => dispatch(logout())} variant="link" asChild>
                                    <Link to="/login">Logout</Link>
                                </Button>
                            </>
                            :
                            <>
                                <Button variant="link" asChild>
                                    <Link to="/login">Login</Link>
                                </Button>
                                <Button variant="link" asChild>
                                    <Link to="/signup">Signup</Link>
                                </Button>
                            </>
                    }
                </nav>
            </div>
        </header>
    );
};

export default Header;
