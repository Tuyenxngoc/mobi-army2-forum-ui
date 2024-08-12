import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Button, Input, message } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { loginUser } from '~/services/authService';
import useAuth from '~/hooks/useAuth';
import { BASE_URL } from '~/common/contans';
import images from '~/assets';
import { handleError } from '~/utils/errorHandler';

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

    const handleLogin = async (values, { setSubmitting }) => {
        try {
            const response = await loginUser(values);
            if (response.status === 200) {
                const { accessToken, refreshToken } = response.data.data;
                login({ accessToken, refreshToken });
                navigate(from, { replace: true });
            }
        } catch (error) {
            handleError(error, formik, messageApi);
        } finally {
            setSubmitting(false);
        }
    };

    const formik = useFormik({
        initialValues: defaultValue,
        validationSchema: validationSchema,
        onSubmit: handleLogin,
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const renderInput = (name, label, type = 'text', props = {}) => (
        <div className="d-flex justify-content-center align-items-center p-1">
            <label className="text-start w-25" htmlFor={`txt${name}`}>
                {label}
            </label>
            <div>
                <Input
                    {...props}
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

    return (
        <main className="box-container p-2 text-center border-top-0">
            {contextHolder}

            <div className="p-1 fw-bold">Sử dụng tài khoản Mobi Army 2 để đăng nhập.</div>

            <form onSubmit={formik.handleSubmit}>
                {renderInput('username', 'Tên tài khoản', 'text', { autoComplete: 'on' })}
                {renderInput('password', 'Mật khẩu', 'password')}

                <div className="p-1">
                    <Button type="primary" htmlType="submit" loading={formik.isSubmitting}>
                        Đăng nhập
                    </Button>
                </div>

                <div className="p-1">
                    <Button href={BASE_URL + '/oauth2/authorization/google'}>
                        <img width={16} src={images.google} alt="Google" />
                        Đăng nhập với Google
                    </Button>
                </div>
            </form>

            <div>
                <div>
                    <span> Nếu bạn chưa có tài khoản, vui lòng đăng ký </span>
                    <Link className="custom-text-primary" to={'/register'}>
                        Đăng ký
                    </Link>
                </div>
                <Link className="custom-text-primary" to={'/forget-password'}>
                    Quên mật khẩu
                </Link>
            </div>
        </main>
    );
}

export default Login;
