import { Link, useNavigate } from "react-router-dom";
import napthe from "../../assets/images/army.png";
import Style from './Forum.module.scss';
import classNames from "classnames/bind";

const cx = classNames.bind(Style);
function Forum() {

    const navigate = useNavigate();

    const handleLoginClick = () => {
        // Navigate to the login page
        navigate('login');
    };

    const handleRegisterClick = () => {
        // Navigate to the registration page
        navigate('register');
    };

    return (
        <main className="box-container">
            <div className={cx('authSection')}>
                <button onClick={handleLoginClick}>Đăng nhập</button>
                <button onClick={handleRegisterClick}>Đăng ký</button>
                <div className={cx('recharge')}>
                    <a href="/">
                        <img src={napthe} alt="nap the" />
                    </a>
                </div>
            </div>
            <div className={cx('box_forums')}>

            </div>
        </main>
    );
}

export default Forum;