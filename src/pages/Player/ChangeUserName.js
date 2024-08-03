import { Link, useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';
import useAuth from '~/hooks/useAuth';
import { changeUserName } from '~/services/authService';
import { handleError } from '~/utils/errorHandler';

const defaultValue = {
    newUsername: '',
};

const validationSchema = yup.object({
    newUsername: yup
        .string()
        .trim()
        .matches(/^[a-z][a-z0-9]{3,15}$/, 'Tên tài khoản không hợp lệ')
        .required('Tên tài khoản là bắt buộc'),
});

function ChangeUserName() {
    const navigate = useNavigate();

    const { logout } = useAuth();

    const [messageApi, contextHolder] = message.useMessage();

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await changeUserName(values);
            if (response.status === 200) {
                logout(false);
                navigate('/login', { replace: true });
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

            <div className="forum-header">
                <Link to="/player/info">Quay lại</Link>
            </div>

            <div className="p-2">
                <h3 className="forum-border-bottom text-primary">Đổi tên tài khoản</h3>

                <form onSubmit={formik.handleSubmit}>
                    <div className="form-group mb-2">
                        <label htmlFor="newUsername">Tên tài khoản mới</label>
                        <input
                            type="text"
                            className={`form-control ${
                                formik.touched.newUsername && formik.errors.newUsername ? 'is-invalid' : ''
                            }`}
                            id="newUsername"
                            aria-describedby="newUsernameHelp"
                            placeholder="Nhập tên tài khoản"
                            value={formik.values.newUsername}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.newUsername && formik.errors.newUsername ? (
                            <div className="text-danger">{formik.errors.newUsername}</div>
                        ) : (
                            <small id="newUsernameHelp" className="form-text text-muted">
                                Tên tài khoản từ 4 đến 16 kí tự, không chứa kí tự đặc biệt, bắt đầu bằng chữ cái
                            </small>
                        )}
                    </div>

                    <div className="alert alert-light p-2" role="alert">
                        Lưu ý sau khi đổi tên tài khoản bạn phải đăng nhập lại
                    </div>

                    <div className="text-center">
                        <Button type="primary" htmlType="submit" loading={formik.isSubmitting}>
                            Đổi (200 lượng)
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangeUserName;
