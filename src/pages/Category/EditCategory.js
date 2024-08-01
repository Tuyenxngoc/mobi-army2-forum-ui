import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { Button, message } from 'antd';

import { getCategoryByIdForAdmin, updateCategory } from '~/services/categoryService';

const validationSchema = yup.object({
    name: yup
        .string('Nhập tên danh mục')
        .max(15, 'Tên chỉ được tối đa 15 ký tự')
        .matches(/^[\p{L}\s\d]*$/u, 'Tên không được chứa ký tự đặc biệt')
        .required('Tên là bắt buộc'),
});

function EditCategory() {
    const { categoryId } = useParams();

    const [messageApi, contextHolder] = message.useMessage();

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await updateCategory(categoryId, values);
            if (response.status === 200) {
                messageApi.success(response.data.data.message);
            }
            resetForm();
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data) {
                messageApi.error(error.response.data.message);
            } else {
                messageApi.error('Lỗi khi sửa danh mục');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                if (isNaN(categoryId)) {
                    throw new Error('ID không hợp lệ. Vui lòng kiểm tra lại.');
                }

                const response = await getCategoryByIdForAdmin(categoryId);
                const category = response.data.data;
                formik.setValues({
                    name: category.name,
                    description: category.description,
                });
            } catch (error) {
                messageApi.error(`Lỗi khi tải danh mục: ${error.message}`);
            }
        };

        fetchCategory();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryId]);

    return (
        <div className="box-container p-2">
            {contextHolder}

            <h3>Tạo danh mục</h3>

            <form onSubmit={formik.handleSubmit}>
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
                            Tên từ 3 đến 30 kí tự, không chứa kí tự đặc biệt
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
                        rows={3}
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

export default EditCategory;
