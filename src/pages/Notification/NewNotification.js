import * as yup from 'yup';

import { Button, message } from 'antd';
import { useFormik } from 'formik';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.core.css';

import { createPlayerNotification } from '~/services/playerNotificationService';
import { formats, modules } from '~/common/editorConfig';
import { Link } from 'react-router-dom';

const validationSchema = yup.object({
    title: yup
        .string('Nhập tiêu đề')
        .min(10, 'Tiêu đề phải có ít nhất 10 ký tự')
        .max(50, 'Tiêu đề chỉ được tối đa 50 ký tự')
        .matches(/^[\p{L}\s\d]*$/u, 'Tiêu đề không được chứa ký tự đặc biệt')
        .required('Tiêu đề là bắt buộc'),
    message: yup
        .string('Nhập nội dung')
        .min(20, 'Nội dung có ít nhất 20 ký tự')
        .max(2000, 'Nội dung chỉ được tối đa 2000 ký tự')
        .required('Nội dung là bắt buộc'),
});

function NewNotification() {
    const [messageApi, contextHolder] = message.useMessage();

    const formik = useFormik({
        initialValues: {
            title: '',
            message: '',
            isPrivate: false,
        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    async function handleSubmit(values, { setSubmitting, resetForm }) {
        try {
            const response = await createPlayerNotification(values);
            if (response.status === 201) {
                messageApi.success(response.data.data.message);
            }
            resetForm();
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data) {
                messageApi.error(error.response.data.message);
            } else {
                messageApi.error('Lỗi khi tạo thông báo mới');
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="box-container">
            {contextHolder}

            <div className="header">
                <Link to="/forum">Quay lại</Link>
            </div>

            <form className="p-2" onSubmit={formik.handleSubmit}>
                <h4 className="title">Thêm thông báo mới</h4>

                <div className="form-group mb-2">
                    <label htmlFor="title">Tiêu đề</label>
                    <input
                        type="text"
                        className={`form-control ${formik.touched.title && formik.errors.title ? 'is-invalid' : ''}`}
                        id="title"
                        aria-describedby="titleHelp"
                        placeholder="Nhập tiêu đề bài viết"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.title && formik.errors.title ? (
                        <div className="text-danger">{formik.errors.title}</div>
                    ) : (
                        <small id="titleHelp" className="form-text text-muted">
                            Tiêu đề từ 10 đến 50 kí tự, không chứa kí tự đặc biệt
                        </small>
                    )}
                </div>

                <div className="form-group mb-2">
                    <span>Nội dung</span>
                    <ReactQuill
                        className="custom-quill"
                        placeholder="Nhập nội dung thông báo"
                        value={formik.values.message}
                        modules={modules}
                        formats={formats}
                        onChange={(value) => formik.setFieldValue('message', value)}
                        onBlur={() => formik.setFieldTouched('message', true)}
                    />
                    {formik.touched.message && formik.errors.message ? (
                        <div className="text-danger">{formik.errors.message}</div>
                    ) : null}
                </div>

                <div className="form-group mb-2">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="isPrivate"
                        name="isPrivate"
                        checked={formik.values.isPrivate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <label className="form-check-label" htmlFor="isPrivate">
                        Chỉ dành cho quản trị
                    </label>
                </div>

                <div className="text-center">
                    <Button type="primary" htmlType="submit" loading={formik.isSubmitting}>
                        Đăng
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default NewNotification;
