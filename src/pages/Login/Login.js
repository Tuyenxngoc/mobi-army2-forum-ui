import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Button, Input, message } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';

import Style from './Login.module.scss';
import classNames from 'classnames/bind';

import { loginUser } from '~/services/authService';
import useAuth from '~/hooks/useAuth';
import { BASE_URL } from '~/common/contans';

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
    const navigate = useNavigate();
    const location = useLocation();

    const [messageApi, contextHolder] = message.useMessage();
    const { isAuthenticated, login } = useAuth();

    const from = location.state?.from?.pathname || '/';

    const formik = useFormik({
        initialValues: defaultValue,
        validationSchema: validationSchema,
        onSubmit: handleLogin,
    });

    async function handleLogin(values, { setSubmitting }) {
        try {
            const response = await loginUser(values);
            if (response.status === 200) {
                const { accessToken, refreshToken } = response.data.data;
                login({ accessToken, refreshToken });
                navigate(from, { replace: true });
            }
        } catch (error) {
            let message = '';
            if (!error?.response) {
                message = 'Máy chủ không phản hồi';
            } else {
                message = error?.response?.data?.message || 'Thông tin đăng nhập không đúng';
            }
            messageApi.error(message);
        } finally {
            setSubmitting(false);
        }
    }

    const renderInput = (name, label, type = 'text') => (
        <div className={cx('formControl')}>
            <label className={cx('formlabel')} htmlFor={`txt${name}`}>
                {label}
            </label>
            <div>
                <Input
                    id={`txt${name}`}
                    name={name}
                    type={type}
                    value={formik.values[name]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    status={formik.touched[name] && formik.errors[name] ? 'error' : undefined}
                />
                <div className="text-danger">{formik.touched[name] && formik.errors[name]}</div>
            </div>
        </div>
    );

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    return (
        <main className={cx('wrapper')}>
            {contextHolder}

            <div className={cx('title')}>Sử dụng tài khoản Mobi Army 2 để đăng nhập.</div>

            <form onSubmit={formik.handleSubmit}>
                {renderInput('username', 'Tên tài khoản')}
                {renderInput('password', 'Mật khẩu', 'password')}

                <div className={cx('formControl')}>
                    <Button type="primary" htmlType="submit" loading={formik.isSubmitting}>
                        Đăng nhập
                    </Button>
                </div>
            </form>

            <a href={BASE_URL + '/oauth2/authorization/google'}>Đăng nhập với Google</a>

            <div className={cx('footer')}>
                <div className={cx('register')}>
                    <span>Nếu bạn chưa có tài khoản, vui lòng đăng ký </span>
                    <Link className={cx('link')} to={'/register'}>
                        Đăng ký
                    </Link>
                </div>
                <Link className={cx('link')} to={'/forget-password'}>
                    Quên mật khẩu
                </Link>
            </div>
        </main>
    );
}

export default Login;
