import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Header = () => {
    return (
        <header className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <nav>
                    <Button variant="link" asChild>
                        <Link to="/">Dashboard</Link>
                    </Button>
                    <Button variant="link" asChild>
                        <Link to="/events">Events</Link>
                    </Button>
                    <Button variant="link" asChild>
                        <Link to="/profile">Profile</Link>
                    </Button>
                    <Button variant="link" asChild>
                        <Link to="/login">Login</Link>
                    </Button>
                    <Button variant="link" asChild>
                        <Link to="/signup">Signup</Link>
                    </Button>
                </nav>
            </div>
        </header>
    );
};

export default Header;
