import { Link } from 'react-router-dom';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { Button, message } from 'antd';

import { createCategory } from '~/services/categoryService';
import { handleError } from '~/utils/errorHandler';

const defaultValue = {
    name: '',
    description: '',
};

const validationSchema = yup.object({
    name: yup
        .string('Nhập tên danh mục')
        .max(15, 'Tên danh mục chỉ được tối đa 15 ký tự')
        .matches(/^[\p{L}\s\d]*$/u, 'Tên danh mục không được chứa ký tự đặc biệt')
        .required('Tên danh mục là bắt buộc'),
});

function AddCategory() {
    const [messageApi, contextHolder] = message.useMessage();

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await createCategory(values);
            if (response.status === 200) {
                messageApi.success(response.data.data.message);
            }
            resetForm();
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
                <Link to="/admin/category">Quay lại</Link>
            </div>

            <form className="p-2" onSubmit={formik.handleSubmit}>
                <h4 className="title">Tạo mới danh mục</h4>

                <div className="form-group mb-2">
                    <label htmlFor="name">Tên danh mục</label>
                    <input
                        type="text"
                        className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                        id="name"
                        name="name"
                        aria-describedby="nameHelp"
                        placeholder="Nhập tên danh mục"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.name && formik.errors.name ? (
                        <div className="text-danger">{formik.errors.name}</div>
                    ) : (
                        <small id="nameHelp" className="form-text text-muted">
                            Tên từ 3 đến 15 kí tự, không chứa kí tự đặc biệt
                        </small>
                    )}
                </div>

                <div className="form-group mb-2">
                    <label htmlFor="description">Mô tả</label>
                    <textarea
                        className={`form-control ${
                            formik.touched.description && formik.errors.description ? 'is-invalid' : ''
                        }`}
                        id="description"
                        name="description"
                        rows={2}
                        placeholder="Nhập mô tả"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.description && formik.errors.description ? (
                        <div className="text-danger">{formik.errors.description}</div>
                    ) : null}
                </div>

                <div className="text-center">
                    <Button type="primary" htmlType="submit" loading={formik.isSubmitting}>
                        Thêm mới
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default AddCategory;
