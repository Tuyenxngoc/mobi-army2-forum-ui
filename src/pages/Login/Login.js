import { Link } from "react-router-dom";

import Style from './Login.module.scss';
import classNames from "classnames/bind";

const cx = classNames.bind(Style);

function Login() {
    return (
        <main className={cx('wrapper')}>
            <div className={cx('title')}>
                Sử dụng tài khoản Mobi Army 2 để đăng nhập.
            </div>

            <form>
                <div className={cx('formControl')}>
                    <label className={cx('formlabel')} htmlFor="txtUsername">Tên tài khoản</label>
                    <input className={cx('formInput')} id="txtUsername" type="text" />
                </div>

                <div className={cx('formControl')}>
                    <label className={cx('formlabel')} htmlFor="txtPassword">Mật khẩu</label>
                    <input className={cx('formInput')} id="txtPassword" type="password" />
                </div>

                <div className={cx('formControl')}>
                    <button type="submit">Đăng nhập</button>
                </div>
            </form>

            <div className={cx('footer')}>
                <div className={cx('register')}>
                    <span>Nếu bạn chưa có tài khoản, vui lòng đăng ký</span>
                    <Link className={cx('link')} to={'/forum/register'}> Đăng ký</Link>
                </div>
                <Link className={cx('link')} to={'./forget'}>Quên mật khẩu</Link>
            </div>
        </main>
    );
}

export default Login;