import { Button, Input, message } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { forgetPassword } from '~/services/authService';
import { handleError } from '~/utils/errorHandler';

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
            handleError(error, formik, messageApi);
        } finally {
            actions.setSubmitting(false);
        }
    };

    const formik = useFormik({
        initialValues: defaultValue,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    const renderInput = (name, label, type = 'text', props = {}) => (
        <div className="d-flex align-items-center justify-content-center p-1">
            <label className="w-25" htmlFor={`txt${name}`}>
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
        <div className="box-container p-2 border-top-0 text-center">
            {contextHolder}

            <div className="fw-bold">Quên Mật Khẩu</div>

            <form onSubmit={formik.handleSubmit}>
                {renderInput('username', 'Tên tài khoản', 'text', { autoComplete: 'on' })}
                {renderInput('email', 'Email', 'email', { autoComplete: 'on' })}

                <div className="p-1">
                    <Button size="small" type="primary" htmlType="submit" loading={formik.isSubmitting}>
                        Gửi Email Khôi Phục
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default ForgetPassword;
