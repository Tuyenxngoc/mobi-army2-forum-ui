import { Link } from 'react-router-dom';

import { useFormik } from 'formik';
import * as yup from 'yup';

import Style from './Register.module.scss';
import classNames from 'classnames/bind';
import { register } from '~/services/authService';
import { message } from 'antd';

const cx = classNames.bind(Style);

const validationSchema = yup.object({
    fullName: yup
        .string()
        .trim()
        .matches(/^\S+(?:\s+\S+)+$/, 'Họ và tên không hợp lệ')
        .required('Họ và tên là bắt buộc'),

    phoneNumber: yup
        .string()
        .trim()
        .matches(/^(?:\+84|0)(?:1[2689]|9[0-9]|3[2-9]|5[6-9]|7[0-9])(?:\d{7}|\d{8})$/, 'Số điện thoại không hợp lệ')
        .required('Số điện thoại là bắt buộc'),

    email: yup.string().trim().email('Email không hợp lệ').required('Email là bắt buộc'),

    username: yup
        .string()
        .trim()
        .matches(/^[a-z][a-z0-9]{3,15}$/, 'Tên tài khoản không hợp lệ')
        .required('Tên tài khoản là bắt buộc'),

    password: yup
        .string()
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, 'Mật khẩu phải bao gồm ít nhất một chữ cái và một số')
        .required('Mật khẩu là bắt buộc'),

    repeatPassword: yup
        .string()
        .trim()
        .oneOf([yup.ref('password'), null], 'Mật khẩu xác nhận phải giống với mật khẩu đã nhập')
        .required('Xác nhận mật khẩu là bắt buộc'),
});

const defaultValue = {
    fullName: '',
    phoneNumber: '',
    email: '',
    username: '',
    password: '',
    repeatPassword: '',
};

function Register() {
    const [messageApi, contextHolder] = message.useMessage();

    const formik = useFormik({
        initialValues: defaultValue,
        validationSchema: validationSchema,
        onSubmit: handleRegister,
    });

    async function handleRegister(values, { setSubmitting }) {
        try {
            const response = await register(values);
            if (response.status === 200) {
                messageApi.success('Đăng kí thành công');
            }
        } catch (error) {
            let message = '';
            if (!error?.response) {
                message = 'Máy chủ không phản hồi';
            } else {
                if (error.response.status === 409) {
                    message = error?.response?.data?.message;
                } else {
                    message = 'Có lỗi xảy ra, vui lòng thử lại';

                    const errorMessages = error?.response?.data?.message;

                    Object.keys(errorMessages).forEach((field) => {
                        formik.setFieldError(field, errorMessages[field]);
                    });
                }
            }
            messageApi.error(message);
        } finally {
            setSubmitting(false);
        }
    }

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
            {contextHolder}

            <form onSubmit={formik.handleSubmit}>
                {renderInput('fullName', 'Họ và tên')}
                {renderInput('phoneNumber', 'Số điện thoại', 'tel')}
                {renderInput('email', 'Email', 'email')}
                {renderInput('username', 'Tên tài khoản')}
                {renderInput('password', 'Mật khẩu', 'password', true)}
                {renderInput('repeatPassword', 'Xác nhận mật khẩu', 'password')}
                <p>
                    <span>- Bạn có thể đăng ký tại đây, hoặc ngay trong trò chơi</span>
                    <br />
                    <span>- Mobi Army 2 dùng tài khoản riêng, không dùng chung với các game khác</span>
                    <br />
                    <span>- Số điện thoại / Email của bạn sẽ không hiện ra bất kỳ chỗ nào khác</span>
                    <br />
                    <span>
                        - Bất kỳ ai giữ số điện thoại hoặc email bạn dùng đăng ký đều có thể lấy lại mật khẩu. Do đó
                        đừng dùng SĐT/Email của người khác
                    </span>
                    <br />
                    <span>
                        - Không cung cấp mật khẩu cho bất kỳ ai. Admin không bao giờ hỏi mật khẩu của bạn. Không nên
                        dùng mật khẩu quá dễ đoán như: 12345, abcde, adgjmp...
                    </span>
                    <br />
                    <span>- Tài khoản đăng ký có thể dùng đăng nhập trong game, và trên diễn đàn Mobi Army 2 này</span>
                    <br />
                </p>
                <div className={cx('formControl')}>
                    <button type="submit" disabled={formik.isSubmitting}>
                        Đăng ký
                    </button>
                </div>
                <p>
                    Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                </p>
            </form>
        </main>
    );
}

export default Register;
