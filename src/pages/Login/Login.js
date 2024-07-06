import { Link } from 'react-router-dom';

import { useFormik } from 'formik';
import * as yup from 'yup';

import Style from './Login.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';
import { login } from '~/services/authService';

const cx = classNames.bind(Style);

const validationSchema = yup.object({
    username: yup.string().trim().required('Vui lòng nhập tên tài khoản'),

    password: yup.string().required('Vui lòng nhập mật khẩu'),
});

const defaultValue = {
    username: '',
    password: '',
};

function Login() {
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik({
        initialValues: defaultValue,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleLogin(values);
        },
    });

    const handleLogin = async (values) => {
        setIsLoading(true);
        try {
            const response = await login(values);
            if (response.status === 200) {
            }
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    };

    const renderInput = (name, label, type = 'text') => (
        <>
            <div className={cx('formControl')}>
                <label className={cx('formlabel')} htmlFor={`txt${name}`}>
                    {label}
                </label>
                <input
                    id={`txt${name}`}
                    name={name}
                    type={type}
                    value={formik.values[name]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={cx('formInput', { error: formik.touched[name] && Boolean(formik.errors[name]) })}
                />
            </div>
            <small className={cx('error')}>{formik.touched[name] && formik.errors[name]}</small>
        </>
    );

    return (
        <main className={cx('wrapper')}>
            <div className={cx('title')}>Sử dụng tài khoản Mobi Army 2 để đăng nhập.</div>

            <form onSubmit={formik.handleSubmit}>
                {renderInput('username', 'Tên tài khoản')}
                {renderInput('password', 'Mật khẩu', 'password')}

                <div className={cx('formControl')}>
                    <button type="submit">Đăng nhập</button>
                </div>
            </form>

            <div className={cx('footer')}>
                <div className={cx('register')}>
                    <span>Nếu bạn chưa có tài khoản, vui lòng đăng ký</span>
                    <Link className={cx('link')} to={'/forum/register'}>
                        Đăng ký
                    </Link>
                </div>
                <Link className={cx('link')} to={'./forget'}>
                    Quên mật khẩu
                </Link>
            </div>
        </main>
    );
}

export default Login;
