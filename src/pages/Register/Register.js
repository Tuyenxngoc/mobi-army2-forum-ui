import { Link } from 'react-router-dom';

import { useFormik } from 'formik';
import * as yup from 'yup';

import Style from './Register.module.scss';
import classNames from "classnames/bind";

const cx = classNames.bind(Style);

const validationSchema = yup.object({
    name: yup.string().trim()
        .required('Họ và tên là bắt buộc'),

    phoneNumber: yup.string().trim()
        .required('Số điện thoại là bắt buộc'),

    email: yup.string().trim()
        .email('Email không hợp lệ')
        .required('Email là bắt buộc'),

    username: yup.string().trim()
        .required('Tên tài khoản là bắt buộc'),

    password: yup.string()
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .required('Mật khẩu là bắt buộc'),

    confirmPassword: yup.string().trim()
        .oneOf([yup.ref('password'), null], 'Mật khẩu xác nhận phải giống với mật khẩu đã nhập')
        .required('Xác nhận mật khẩu là bắt buộc')
});

const defaultValue = {
    name: '',
    phoneNumber: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
}

function Register() {

    const formik = useFormik({
        initialValues: defaultValue,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    return (
        <main className={cx('wrapper')}>
            <form onSubmit={formik.handleSubmit}>
                <div className={cx('formControl')}>
                    <label className={cx('formlabel')} htmlFor="txtName">Họ và tên</label>
                    <input
                        className={cx('formInput')}
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name='name'
                        id="txtName"
                        type="text"
                    />
                </div>
                <small className={cx('error')}>{formik.touched.name && formik.errors.name}</small>

                <div className={cx('formControl')}>
                    <label className={cx('formlabel')} htmlFor="txtPhoneNumber">Số điện thoại</label>
                    <input
                        className={cx('formInput')}
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name='phoneNumber'
                        id="txtPhoneNumber"
                        type="tel"
                    />
                </div>
                <small className={cx('error')}>{formik.touched.phoneNumber && formik.errors.phoneNumber}</small>

                <div className={cx('formControl')}>
                    <label className={cx('formlabel')} htmlFor="txtEmail">Email</label>
                    <input
                        className={cx('formInput')}
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name='email'
                        id="txtEmail"
                        type="email"
                    />
                </div>
                <small className={cx('error')}>{formik.touched.email && formik.errors.email}</small>

                <div className={cx('formControl')}>
                    <label className={cx('formlabel')} htmlFor="txtUsername">Tên tài khoản</label>
                    <input
                        className={cx('formInput')}
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name='username'
                        id="txtUsername"
                        type="text"
                    />
                </div>
                <small className={cx('error')}>{formik.touched.username && formik.errors.username}</small>

                <div className={cx('formControl')}>
                    <label className={cx('formlabel')} htmlFor="txtPassword">Mật khẩu</label>
                    <input
                        className={cx('formInput')}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name='password'
                        id="txtPassword"
                        type="password"
                    />
                </div>
                <small className={cx('error')}>{formik.touched.password && formik.errors.password}</small>

                <div className={cx('formControl')}>
                    <label className={cx('formlabel')} htmlFor="txtConfirmPassword">Xác nhận mật khẩu</label>
                    <input
                        className={cx('formInput')}
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name='confirmPassword'
                        id="txtConfirmPassword"
                        type="password"
                    />
                </div>
                <small className={cx('error')}>{formik.touched.confirmPassword && formik.errors.confirmPassword}</small>

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
                    <button
                        type="submit">Đăng ký</button>
                </div>
                <p>
                    Bạn đã có tài khoản? <Link to='/forum/login'>Đăng nhập</Link>
                </p>
            </form>

        </main>
    );
}

export default Register;