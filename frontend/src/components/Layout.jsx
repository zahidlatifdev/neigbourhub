import PropTypes from 'prop-types';
import Header from './Header';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
};

Layout.propTypes = {
    children: PropTypes.object.isRequired,
}

export default Layout;
