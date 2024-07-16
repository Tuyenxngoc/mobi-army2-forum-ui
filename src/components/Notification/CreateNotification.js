import PropTypes from 'prop-types';

import { useFormik } from 'formik';
import * as yup from 'yup';
import { createNotification } from '~/services/NotificationService';
import { message } from 'antd';

const validationSchema = yup.object({
    title: yup.string().trim().required('Tiêu đề là bắt buộc'),

    content: yup.string().trim().required('Nội dung là bắt buộc'),
});

const defaultValue = {
    title: '',
    content: '',
};

function CreateNotification({ fetchNotifications }) {
    const [messageApi, contextHolder] = message.useMessage();

    const formik = useFormik({
        initialValues: defaultValue,
        validationSchema: validationSchema,
        onSubmit: handleCreateNotification,
    });

    async function handleCreateNotification(values, { setSubmitting, resetForm }) {
        try {
            await createNotification(values);
            fetchNotifications();
            resetForm();
            messageApi.success('Thêm thông báo thành công');
        } catch (error) {
            messageApi.error('Thêm thông báo thất bại', error.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="box-container p-2">
            {contextHolder}

            <h3>Thêm thông báo mới</h3>
            <form onSubmit={formik.handleSubmit}>
                <div className="form-group mb-2">
                    <label htmlFor="inputTitle">Tiêu đề</label>
                    <input
                        id="inputTitle"
                        className={`form-control ${formik.touched.title && formik.errors.title ? 'is-invalid' : ''}`}
                        type="text"
                        name="title"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.title && formik.errors.title ? (
                        <div className="invalid-feedback">{formik.errors.title}</div>
                    ) : null}
                </div>

                <div className="form-group mb-2">
                    <label htmlFor="inputContent">Nội dung</label>
                    <textarea
                        id="inputContent"
                        className={`form-control ${
                            formik.touched.content && formik.errors.content ? 'is-invalid' : ''
                        }`}
                        name="content"
                        rows="3"
                        value={formik.values.content}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.content && formik.errors.content ? (
                        <div className="invalid-feedback">{formik.errors.content}</div>
                    ) : null}
                </div>

                <div className="text-center">
                    <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
                        Thêm mới
                    </button>
                </div>
            </form>
        </div>
    );
}

CreateNotification.propTypes = {
    fetchNotifications: PropTypes.func.isRequired,
};

export default CreateNotification;
