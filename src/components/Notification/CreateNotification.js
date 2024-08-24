import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.core.css';

import { createNotification } from '~/services/NotificationService';
import { formats, modules } from '~/common/editorConfig';
import { Button } from 'antd';

const validationSchema = yup.object({
    title: yup
        .string()
        .trim()
        .min(3, 'Tiêu đề phải có ít nhất 3 ký tự')
        .max(50, 'Tiêu đề chỉ được tối đa 50 ký tự')
        .required('Tiêu đề là bắt buộc'),

    content: yup
        .string()
        .trim()
        .min(10, 'Nội dung có ít nhất 10 ký tự')
        .max(2000, 'Nội dung chỉ được tối đa 2000 ký tự')
        .required('Nội dung là bắt buộc'),
});

const defaultValue = {
    title: '',
    content: '',
};

function CreateNotification({ onAddNotification, messageApi }) {
    const handleNotificationCreate = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await createNotification(values);
            onAddNotification(response.data.data);
            resetForm();
            messageApi.success('Thêm thông báo thành công');
        } catch (error) {
            messageApi.error('Thêm thông báo thất bại: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const formik = useFormik({
        initialValues: defaultValue,
        validationSchema: validationSchema,
        onSubmit: handleNotificationCreate,
    });

    return (
        <div className="box-container p-2 mt-1">
            <h4 className="title">Thêm thông báo mới</h4>

            <form onSubmit={formik.handleSubmit}>
                <div className="form-group mb-2">
                    <label htmlFor="inputTitle">Tiêu đề</label>
                    <input
                        id="inputTitle"
                        className={`form-control ${formik.touched.title && formik.errors.title ? 'is-invalid' : ''}`}
                        type="text"
                        name="title"
                        placeholder="Nhập tiêu đề thông báo"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.title && formik.errors.title ? (
                        <div className="invalid-feedback">{formik.errors.title}</div>
                    ) : null}
                </div>

                <div className="form-group mb-2">
                    <span>Nội dung</span>
                    <ReactQuill
                        className="custom-quill"
                        placeholder="Nhập nội dung thông báo"
                        value={formik.values.content}
                        modules={modules}
                        formats={formats}
                        onChange={(value) => formik.setFieldValue('content', value)}
                        onBlur={() => formik.setFieldTouched('content', true)}
                    />
                    {formik.touched.content && formik.errors.content ? (
                        <div className="text-danger">{formik.errors.content}</div>
                    ) : null}
                </div>

                <div className="text-center">
                    <Button htmlType="submit" type="primary" loading={formik.isSubmitting}>
                        Thêm mới
                    </Button>
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
