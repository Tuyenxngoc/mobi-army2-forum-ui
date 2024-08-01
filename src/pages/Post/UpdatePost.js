import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, message } from 'antd';

import { getAllCategories } from '~/services/categoryService';
import { getPostForAdminById, updatePost } from '~/services/postService';

import ReactQuill from 'react-quill';
import { formats, modules } from '~/common/editorConfig';

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
        .max(2000, 'Nội dung chỉ được tối đa 2000 ký tự')
        .required('Nội dung là bắt buộc'),
    priority: yup
        .number('Nhập số thứ tự hiển thị')
        .integer('Số thứ tự phải là số nguyên')
        .min(0, 'Số thứ tự không được nhỏ hơn 0'),
});

function UpdatePost() {
    const { postId } = useParams();

    const [categories, setCategories] = useState([]);

    const [messageApi, contextHolder] = message.useMessage();

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await updatePost(postId, values);
            if (response.status === 200) {
                messageApi.success('Lưu thành công');
            }
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data) {
                messageApi.error(error.response.data.message);
            } else {
                messageApi.error('Lỗi khi sửa bài viết');
            }
        } finally {
            setSubmitting(false);
        }
    };

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
                messageApi.error(`Lỗi khi tải danh mục: ${error.message}`);
            }
        };

        fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                if (isNaN(postId)) {
                    throw new Error('ID không hợp lệ. Vui lòng kiểm tra lại.');
                }

                const response = await getPostForAdminById(postId);
                const post = response.data.data;
                formik.setValues({
                    title: post.title,
                    content: post.content,
                    categoryId: post?.category?.id || '',
                    priority: post.priority,
                });
            } catch (error) {
                messageApi.error(`Lỗi khi tải bài viết: ${error.message}`);
            }
        };

        fetchPost();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postId]);

    const formik = useFormik({
        initialValues: defaultValue,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    return (
        <div className="box-container">
            {contextHolder}

            <div className="forum-header">
                <Link to="/admin/post">Quay lại</Link>
            </div>

            <h3 className="p-2 pb-0">Sửa bài viết</h3>

            <form className="p-2" onSubmit={formik.handleSubmit}>
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
                    <label>Nội dung</label>
                    <ReactQuill
                        id="content"
                        className="custom-quill"
                        name="content"
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
                </div>

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

                <div className="text-center">
                    <Button type="primary" htmlType="submit" loading={formik.isSubmitting}>
                        Lưu
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default UpdatePost;
