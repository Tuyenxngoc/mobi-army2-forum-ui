import { Link } from 'react-router-dom';
import { Button, message } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { changeUserName } from '~/services/authService';
import { handleError } from '~/utils/errorHandler';
import useAuth from '~/hooks/useAuth';

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
    const { loadUserInfo } = useAuth();

    const [messageApi, contextHolder] = message.useMessage();

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await changeUserName(values);
            if (response.status === 200) {
                messageApi.success(response.data.data.message);
                loadUserInfo();
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
                <Link to="/player/info">Quay lại</Link>
            </div>

            <div className="p-2">
                <h4 className="title">Đổi tên tài khoản</h4>

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
