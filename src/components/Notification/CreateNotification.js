import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.core.css';

import { createNotification } from '~/services/NotificationService';
import { formats, modules } from '~/common/editorConfig';

const validationSchema = yup.object({
    title: yup.string().trim().required('Tiêu đề là bắt buộc'),
    content: yup.string().trim().required('Nội dung là bắt buộc'),
});

const defaultValue = {
    title: '',
    content: '',
};

function CreateNotification({ onAddNotification, messageApi }) {
    const formik = useFormik({
        initialValues: defaultValue,
        validationSchema: validationSchema,
        onSubmit: handleNotificationCreate,
    });

    async function handleNotificationCreate(values, { setSubmitting, resetForm }) {
        try {
            const response = await createNotification(values);
            onAddNotification(response.data.data);
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
                    <ReactQuill
                        id="inputContent"
                        className="custom-quill"
                        value={formik.values.content}
                        modules={modules}
                        formats={formats}
                        onChange={(value) => formik.setFieldValue('content', value)}
                    />
                    {formik.errors.content ? <div className="invalid-feedback">{formik.errors.content}</div> : null}
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
    onAddNotification: PropTypes.func.isRequired,
    messageApi: PropTypes.object.isRequired,
};

export default CreateNotification;
