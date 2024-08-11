import { Link } from 'react-router-dom';
import { Button, message } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { changePassword } from '~/services/authService';
import { handleError } from '~/utils/errorHandler';
import useAuth from '~/hooks/useAuth';

const defaultValue = {
    oldPassword: '',
    password: '',
    repeatPassword: '',
};

const validationSchema = yup.object({
    oldPassword: yup.string().required('Mật khẩu cũ là bắt buộc'),

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

function ChangePassword() {
    const [messageApi, contextHolder] = message.useMessage();
    const { player } = useAuth();

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await changePassword(values);
            if (response.status === 200) {
                messageApi.success(response.data.data.message);
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
        onSubmit: handleSubmit,
    });

    return (
        <div className="box-container">
            {contextHolder}

            <div className="header">
                <Link to={`/player/${player.id}`}>Quay lại</Link>
            </div>

            <div className="p-2">
                <h4 className="title">Đổi mật khẩu</h4>

                <form onSubmit={formik.handleSubmit}>
                    <div className="form-group mb-2">
                        <label htmlFor="oldPassword">Mật khẩu cũ</label>
                        <input
                            type="password"
                            className={`form-control ${
                                formik.touched.oldPassword && formik.errors.oldPassword ? 'is-invalid' : ''
                            }`}
                            id="oldPassword"
                            aria-describedby="oldPasswordHelp"
                            placeholder="Nhập mật khẩu cũ"
                            value={formik.values.oldPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.oldPassword && formik.errors.oldPassword ? (
                            <div className="text-danger">{formik.errors.oldPassword}</div>
                        ) : (
                            <small id="oldPasswordHelp" className="form-text text-muted">
                                Nhập mật khẩu cũ của bạn
                            </small>
                        )}
                    </div>

                    <div className="form-group mb-2">
                        <label htmlFor="password">Mật khẩu mới</label>
                        <input
                            type="password"
                            className={`form-control ${
                                formik.touched.password && formik.errors.password ? 'is-invalid' : ''
                            }`}
                            id="password"
                            aria-describedby="passwordHelp"
                            placeholder="Nhập mật khẩu mới"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.password && formik.errors.password ? (
                            <div className="text-danger">{formik.errors.password}</div>
                        ) : (
                            <small id="passwordHelp" className="form-text text-muted">
                                Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ cái và số
                            </small>
                        )}
                    </div>

                    <div className="form-group mb-2">
                        <label htmlFor="repeatPassword">Xác nhận mật khẩu mới</label>
                        <input
                            type="password"
                            className={`form-control ${
                                formik.touched.repeatPassword && formik.errors.repeatPassword ? 'is-invalid' : ''
                            }`}
                            id="repeatPassword"
                            aria-describedby="repeatPasswordHelp"
                            placeholder="Nhập lại mật khẩu mới"
                            value={formik.values.repeatPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.repeatPassword && formik.errors.repeatPassword ? (
                            <div className="text-danger">{formik.errors.repeatPassword}</div>
                        ) : (
                            <small id="repeatPasswordHelp" className="form-text text-muted">
                                Vui lòng nhập lại mật khẩu mới
                            </small>
                        )}
                    </div>

                    <div className="text-center">
                        <Button type="primary" htmlType="submit" loading={formik.isSubmitting}>
                            Đổi mật khẩu
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;
