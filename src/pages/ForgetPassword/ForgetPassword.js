import { Button, Input, message } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { forgetPassword } from '~/services/authService';

import Style from './ForgetPassword.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(Style);

const validationSchema = yup.object({
    username: yup.string().trim().required('Vui lòng nhập tên tài khoản'),

    email: yup.string().trim().email('Email không hợp lệ').required('Vui lòng nhập email'),
});

const defaultValue = {
    username: '',
    email: '',
};

function ForgetPassword() {
    const [messageApi, contextHolder] = message.useMessage();

    const handleSubmit = async (values, actions) => {
        try {
            const response = await forgetPassword(values);
            if (response.status === 200 && response?.data?.data?.message) {
                messageApi.success(response.data.data.message);
            }
        } catch (error) {
            let message = '';
            if (!error?.response) {
                message = 'Máy chủ không phản hồi';
            } else {
                message = error?.response?.data?.message || 'Có lỗi xảy ra vui lòng thử lại sau';
            }
            messageApi.error(message);
        } finally {
            actions.setSubmitting(false);
        }
    };

    const formik = useFormik({
        initialValues: defaultValue,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

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

    return (
        <div className={cx('wrapper', 'box-container', 'p-2')}>
            {contextHolder}

            <div className={cx('title')}>Quên Mật Khẩu</div>

            <form onSubmit={formik.handleSubmit}>
                {renderInput('username', 'Tên tài khoản')}
                {renderInput('email', 'Email', 'email')}

                <div>
                    <Button type="primary" htmlType="submit" loading={formik.isSubmitting}>
                        Gửi Email Khôi Phục
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default ForgetPassword;
