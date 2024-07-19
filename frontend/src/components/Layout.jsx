import PropTypes from 'prop-types';
import Header from './Header';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Layout;
