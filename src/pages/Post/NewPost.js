import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, message } from 'antd';

import useAuth from '~/hooks/useAuth';
import { ROLES } from '~/common/roleConstants';
import { getAllCategories } from '~/services/categoryService';
import { createPost } from '~/services/postService';

import ReactQuill from 'react-quill';
import { formats, modules } from '~/common/editorConfig';
import { handleError } from '~/utils/errorHandler';

const defaultValue = {
    title: '',
    content: '',
    categoryId: '',
    priority: 0,
};

const validationSchema = yup.object({
    title: yup
        .string('Nhập tiêu đề')
        .min(10, 'Tiêu đề phải có ít nhất 10 ký tự')
        .max(50, 'Tiêu đề chỉ được tối đa 50 ký tự')
        .matches(/^[\p{L}\s\d]*$/u, 'Tiêu đề không được chứa ký tự đặc biệt')
        .required('Tiêu đề là bắt buộc'),
    content: yup
        .string('Nhập nội dung')
        .min(20, 'Nội dung có ít nhất 20 ký tự')
        .max(3000, 'Nội dung chỉ được tối đa 3000 ký tự')
        .required('Nội dung là bắt buộc'),
    priority: yup
        .number('Nhập số thứ tự hiển thị')
        .integer('Số thứ tự phải là số nguyên')
        .min(0, 'Số thứ tự không được nhỏ hơn 0'),
});

const allowedRoles = {
    [ROLES.SuperAdmin]: true,
    [ROLES.Admin]: true,
};

function NewPost() {
    const [categories, setCategories] = useState([]);

    const [messageApi, contextHolder] = message.useMessage();
    const { player } = useAuth();

    const hasRequiredRole = allowedRoles[player.roleName];

    const formik = useFormik({
        initialValues: defaultValue,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    async function handleSubmit(values, { setSubmitting, resetForm }) {
        try {
            const response = await createPost(values);
            if (response.status === 201) {
                messageApi.success(response.data.data.message);
            }
            resetForm();
        } catch (error) {
            handleError(error, formik, messageApi);
        } finally {
            setSubmitting(false);
        }
    }

    const handleCategoryChange = (event) => {
        const { value } = event.target;
        formik.setFieldValue('categoryId', value === '' ? null : value);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getAllCategories();
                setCategories(response.data.data);
            } catch (error) {
                messageApi.error('Lỗi khi tải danh mục');
            }
        };

        fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="box-container">
            {contextHolder}

            <div className="header">
                <Link to="/forum">Quay lại</Link>
            </div>

            <form className="p-2" onSubmit={formik.handleSubmit}>
                <h4 className="title">Tạo bài viết</h4>

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
                    <label htmlFor="categorySelect">Danh mục</label>
                    <select
                        className="form-control"
                        id="categorySelect"
                        value={formik.values.categoryId || ''}
                        onChange={handleCategoryChange}
                        onBlur={formik.handleBlur}
                        name="categoryId"
                    >
                        <option value="">Chọn danh mục</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {formik.touched.categoryId && formik.errors.categoryId ? (
                        <div className="text-danger">{formik.errors.categoryId}</div>
                    ) : null}
                </div>
                <div className="form-group mb-2">
                    {hasRequiredRole ? (
                        <>
                            <span>Nội dung</span>
                            <ReactQuill
                                className="custom-quill"
                                placeholder="Nhập nội dung bài viết"
                                value={formik.values.content}
                                modules={modules}
                                formats={formats}
                                onChange={(value) => formik.setFieldValue('content', value)}
                                onBlur={() => formik.setFieldTouched('content', true)}
                            />
                            {formik.touched.content && formik.errors.content ? (
                                <div className="text-danger">{formik.errors.content}</div>
                            ) : null}
                        </>
                    ) : (
                        <>
                            <label htmlFor="content">Nội dung</label>
                            <textarea
                                className={`form-control ${
                                    formik.touched.content && formik.errors.content ? 'is-invalid' : ''
                                }`}
                                id="content"
                                rows={3}
                                placeholder="Nhập nội dung bài viết"
                                value={formik.values.content}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                name="content"
                            />
                            {formik.touched.content && formik.errors.content ? (
                                <div className="text-danger">{formik.errors.content}</div>
                            ) : null}
                        </>
                    )}
                </div>

                {hasRequiredRole && (
                    <div className="form-group mb-2">
                        <label htmlFor="priority">Số thứ tự hiển thị</label>
                        <input
                            type="number"
                            className={`form-control ${
                                formik.touched.priority && formik.errors.priority ? 'is-invalid' : ''
                            }`}
                            id="priority"
                            aria-describedby="priorityHelp"
                            placeholder="Nhập số cần xắp xếp"
                            value={formik.values.priority}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.priority && formik.errors.priority ? (
                            <div className="text-danger">{formik.errors.priority}</div>
                        ) : (
                            <small id="priorityHelp" className="form-text text-muted">
                                Số càng lớn độ ưu tiên càng cao
                            </small>
                        )}
                    </div>
                )}

                <div className="alert alert-light" role="alert">
                    Những bài viết vi phạm&nbsp;
                    <Link to="/terms" target="_blank" className="alert-link">
                        Tiêu chuẩn cộng đồng&nbsp;
                    </Link>
                    sẽ không được duyệt
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

export default NewPost;
