import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { message } from 'antd';

import PlayerActions from '~/components/PlayerActions/PlayerActions';
import useAuth from '~/hooks/useAuth';
import { ROLES } from '~/common/contans';
import { checkUserHasRequiredRole } from '~/utils/helper';
import { getAllCategories } from '~/services/categoryService';
import { createPost } from '~/services/postService';

import Style from './NewPost.module.scss';
import classNames from 'classnames/bind';
import ReactQuill from 'react-quill';
import { formats, modules } from '~/common/editorConfig';

const cx = classNames.bind(Style);

const validationSchema = yup.object({
    title: yup
        .string('Nhập tiêu đề')
        .min(10, 'Tiêu đề phải có ít nhất 10 ký tự')
        .max(50, 'Tiêu đề chỉ được tối đa 50 ký tự')
        .matches(/^[\p{L}\s\d]*$/u, 'Tiêu đề không được chứa ký tự đặc biệt')
        .required('Tiêu đề là bắt buộc'),
    content: yup
        .string('Nhập nội dung')
        .min(10, 'Nội dung có ít nhất 10 ký tự')
        .max(2000, 'Nội dung chỉ được tối đa 2000 ký tự')
        .required('Nội dung là bắt buộc'),
});

const allowedRoles = [ROLES.Admin, ROLES.SuperAdmin];

function NewPost() {
    const [categories, setCategories] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const {
        player: { roleName },
    } = useAuth();

    const hasRequiredRole = useMemo(() => checkUserHasRequiredRole(roleName, allowedRoles), [roleName]);

    const formik = useFormik({
        initialValues: {
            title: '',
            content: '',
            categoryId: undefined,
            priority: 0,
        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    async function handleSubmit(values, { setSubmitting, resetForm }) {
        try {
            await createPost(values);
            messageApi.success('Thêm bài viết thành công, vui lòng chờ duyệt');
            resetForm();
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data) {
                messageApi.error(error.response.data.message);
            } else {
                messageApi.error('Error creating new post:', error.message);
            }
        } finally {
            setSubmitting(false);
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await getAllCategories();
            setCategories(response.data.data);
        } catch (error) {
            messageApi.error('Error fetching categories:', error.message);
        }
    };

    useEffect(() => {
        fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="box-container">
            {contextHolder}

            <PlayerActions />

            <div className={cx('header')}>
                <Link to="/forum">Quay lại</Link>
            </div>

            <div className="p-2">
                <h3>Tạo bài viết</h3>
                <form onSubmit={formik.handleSubmit}>
                    <div className="form-group mb-2">
                        <label htmlFor="title">Tiêu đề</label>
                        <input
                            type="text"
                            className={`form-control ${
                                formik.touched.title && formik.errors.title ? 'is-invalid' : ''
                            }`}
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
                            value={formik.values.categoryId}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="categoryId"
                        >
                            <option value={undefined}>Chọn danh mục</option>
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
                        <label htmlFor="content">Nội dung</label>
                        {hasRequiredRole ? (
                            <>
                                <ReactQuill
                                    id="inputContent"
                                    className="custom-quill"
                                    value={formik.values.content}
                                    modules={modules}
                                    formats={formats}
                                    onChange={(value) => formik.setFieldValue('content', value)}
                                />
                                {formik.errors.content ? (
                                    <div className="invalid-feedback">{formik.errors.content}</div>
                                ) : null}
                            </>
                        ) : (
                            <>
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
                                    <div className="invalid-feedback">{formik.errors.content}</div>
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
                        Những bài viết vi phạm{' '}
                        <Link to="/terms" target="_blank" className="alert-link">
                            Tiêu chuẩn cộng đồng{' '}
                        </Link>
                        sẽ không được duyệt
                    </div>

                    <div className="text-center">
                        <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
                            Đăng
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewPost;
