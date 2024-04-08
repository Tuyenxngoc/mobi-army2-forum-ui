
import Style from './Register.module.scss';
import classNames from "classnames/bind";

const cx = classNames.bind(Style);

function Register() {
    return (
        <main className={cx('wrapper')}>
            <form>
                <div className={cx('formControl')}>
                    <label className={cx('formlabel')} htmlFor="txtUsername">Họ và tên</label>
                    <input className={cx('formInput')} id="txtUsername" type="text" />
                </div>
                <div className={cx('formControl')}>
                    <label className={cx('formlabel')} htmlFor="txtUsername">Số điện thoại</label>
                    <input className={cx('formInput')} id="txtUsername" type="text" />
                </div>
                <div className={cx('formControl')}>
                    <label className={cx('formlabel')} htmlFor="txtUsername">Email</label>
                    <input className={cx('formInput')} id="txtUsername" type="text" />
                </div>
                <div className={cx('formControl')}>
                    <label className={cx('formlabel')} htmlFor="txtUsername">Tên tài khoản</label>
                    <input className={cx('formInput')} id="txtUsername" type="text" />
                </div>
                <div className={cx('formControl')}>
                    <label className={cx('formlabel')} htmlFor="txtUsername">Mật khẩu</label>
                    <input className={cx('formInput')} id="txtUsername" type="text" />
                </div>
                <div className={cx('formControl')}>
                    <label className={cx('formlabel')} htmlFor="txtUsername">Xác nhận mật khẩu</label>
                    <input className={cx('formInput')} id="txtUsername" type="text" />
                </div>
                <p>
                    <span>- Bạn có thể đăng ký tại đây, hoặc ngay trong trò chơi</span>
                    <br />
                    <span>- Mobi Army 2 dùng tài khoản riêng, không dùng chung với các game khác</span>
                    <br />
                    <span>- Số điện thoại / Email của bạn sẽ không hiện ra bất kỳ chỗ nào khác</span>
                    <br />
                    <span>- Bất kỳ ai giữ số điện thoại hoặc email bạn dùng đăng ký đều có thể lấy lại mật khẩu. Do đó đừng dùng SĐT/Email của người khác</span>
                    <br />
                    <span>- Không cung cấp mật khẩu cho bất kỳ ai. Admin không bao giờ hỏi mật khẩu của bạn. Không nên dùng mật khẩu quá dễ đoán như: 12345, abcde, adgjmp...</span>
                    <br />
                    <span>- Tài khoản đăng ký có thể dùng đăng nhập trong game, và trên diễn đàn Mobi Army 2 này</span>
                    <br />
                </p>
                <div className={cx('formControl')}>
                    <button type="submit">Đăng ký</button>
                </div>
            </form>

        </main>
    );
}

export default Register;