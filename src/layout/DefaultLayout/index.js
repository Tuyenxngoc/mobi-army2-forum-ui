import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Nav from '../../components/Nav/Nav';

function DefaultLayout() {
    return (
        <div className="container custom-width-630">
            <Header />
            <Nav />
            <Outlet />
            <Footer />
        </div>
    );
}

export default DefaultLayout;
