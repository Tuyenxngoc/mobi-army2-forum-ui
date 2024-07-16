import React, { useState, useEffect, useMemo } from 'react';
import { getAllCategories } from '~/services/categoryService';
import { createPost } from '~/services/postService';

import { useFormik } from 'formik';
import * as yup from 'yup';
import PlayerActions from '~/components/PlayerActions/PlayerActions';
import { Link } from 'react-router-dom';

import Style from './NewPost.module.scss';
import classNames from 'classnames/bind';
import useAuth from '~/hooks/useAuth';
import { ROLES } from '~/common/contans';
import { checkUserHasRequiredRole } from '~/utils/helper';

const cx = classNames.bind(Style);

const validationSchema = yup.object({
    title: yup
        .string('Nhập tiêu đề')
        .min(10, 'Tiêu đề phải có ít nhất 10 ký tự')
        .max(50, 'Tiêu đề chỉ được tối đa 50 ký tự')
        .matches(/^[a-zA-Z0-9\s]+$/, 'Tiêu đề không được chứa ký tự đặc biệt')
        .required('Tiêu đề là bắt buộc'),
    content: yup.string('Nhập nội dung').min(10, 'Nội dung có ít nhất 10 ký tự').required('Nội dung là bắt buộc'),
});

const allowedRoles = [ROLES.Admin, ROLES.SuperAdmin];

function NewPost() {
    const [categories, setCategories] = useState([]);
    const {
        player: { roleName },
    } = useAuth();

    const hasRequiredRole = useMemo(() => checkUserHasRequiredRole(roleName, allowedRoles), [roleName]);

    const formik = useFormik({
        initialValues: {
            title: '',
            content: '',
            categoryId: undefined,
        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    async function handleSubmit(values, { setSubmitting, resetForm }) {
        try {
            await createPost(values);
            alert('Thêm bài viết thành công, vui lòng chờ duyệt');
            resetForm();
        } catch (error) {
            console.error('Error creating new post:', error.message);
        } finally {
            setSubmitting(false);
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await getAllCategories();
            setCategories(response.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error.message);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="box-container">
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
                    </div>

                    {hasRequiredRole && (
                        <div className="form-check">
                            <input type="checkbox" className="form-check-input" id="exampleCheck" />
                            <label className="form-check-label" htmlFor="exampleCheck">
                                Ưu tiên hiển thị
                            </label>
                        </div>
                    )}

                    <div className="alert alert-light" role="alert">
                        Những bài viết vi phạm{' '}
                        <Link to="#" className="alert-link">
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
