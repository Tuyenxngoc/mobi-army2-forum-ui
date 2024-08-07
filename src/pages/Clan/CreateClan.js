import { useState, useEffect, useMemo } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, message } from 'antd';

import { createClan, getclanIcons } from '~/services/clanService';
import { BASE_URL } from '~/common/contans';
import { Link } from 'react-router-dom';
import { handleError } from '~/utils/errorHandler';

const defaultValue = {
    name: '',
    description: '',
    phoneNumber: '',
    email: '',
    icon: 1,
};

const validationSchema = yup.object({
    name: yup
        .string()
        .required('Tên đội là bắt buộc')
        .max(30, 'Tên đội không được quá 30 kí tự')
        .matches(/^[\p{L}\s\d]*$/u, 'Tên đội không được chứa kí tự đặc biệt'),

    description: yup.string().required('Vui lòng thêm mô tả'),

    phoneNumber: yup
        .string()
        .required('Số điện thoại là bắt buộc')
        .matches(/^(?:\+84|0)(?:1[2689]|9[0-9]|3[2-9]|5[6-9]|7[0-9])(?:\d{7}|\d{8})$/, 'Số điện thoại không hợp lệ'),

    email: yup.string().required('Email là bắt buộc').email('Email không hợp lệ'),

    icon: yup.number().required('Bạn phải chọn một ảnh đại diện'),
});

function CreateClan() {
    const [icons, setIcons] = useState([]);

    const [messageApi, contextHolder] = message.useMessage();

    const rows = useMemo(() => {
        const organizedRows = [];
        for (let i = 0; i < icons.length; i += 10) {
            organizedRows.push(icons.slice(i, i + 10));
        }
        return organizedRows;
    }, [icons]);

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await createClan(values);
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

    useEffect(() => {
        const fetchIcons = async () => {
            try {
                const response = await getclanIcons();
                setIcons(response.data.data);
            } catch (error) {
                messageApi.error('Lỗi khi tải icons: ' + error.message);
            }
        };

        fetchIcons();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="box-container">
            {contextHolder}

            <div className="forum-header">
                <Link to="/clan">Quay lại</Link>
            </div>

            <h3 className="p-2 pb-0">Đăng ký thành lập đội</h3>
            <small className="form-text text-muted p-2">Lưu ý: cần điền thông tin chính xác để lấy lại mật khẩu.</small>

            <form className="p-2 mt-4" onSubmit={formik.handleSubmit}>
                <div className="form-group mb-2">
                    <label htmlFor="name">Tên đội</label>
                    <input
                        type="text"
                        className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                        id="name"
                        aria-describedby="nameHelp"
                        placeholder="Nhập tên biệt đội"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.name && formik.errors.name ? (
                        <div className="text-danger">{formik.errors.name}</div>
                    ) : (
                        <small id="nameHelp" className="form-text text-muted">
                            Tên tối đa 30 kí tự, không chứa kí tự đặc biệt
                        </small>
                    )}
                </div>

                <div className="form-group mb-2">
                    <label htmlFor="description">Giới thiệu</label>
                    <textarea
                        rows={2}
                        type="text"
                        className={`form-control ${
                            formik.touched.description && formik.errors.description ? 'is-invalid' : ''
                        }`}
                        id="description"
                        aria-describedby="descriptionHelp"
                        placeholder="Nhập mô tả"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />

                    {formik.touched.description && formik.errors.description ? (
                        <div className="text-danger">{formik.errors.description}</div>
                    ) : (
                        <small id="descriptionHelp" className="form-text text-muted">
                            Mô tải biệt đội tối đa 255 kí tự
                        </small>
                    )}
                </div>

                <div className="form-group mb-2">
                    <label htmlFor="phoneNumber">Số điện thoại</label>
                    <input
                        type="text"
                        className={`form-control ${
                            formik.touched.phoneNumber && formik.errors.phoneNumber ? 'is-invalid' : ''
                        }`}
                        id="phoneNumber"
                        aria-describedby="phoneNumberHelp"
                        placeholder="Nhập số điện thoại"
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                        <div className="text-danger">{formik.errors.phoneNumber}</div>
                    ) : (
                        <small id="phoneNumberHelp" className="form-text text-muted">
                            Số điện thoại tối đa 20 kí tự
                        </small>
                    )}
                </div>

                <div className="form-group mb-2">
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        aria-describedby="emailHelp"
                        placeholder="Nhập địa chỉ email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <div className="text-danger">{formik.errors.email}</div>
                    ) : (
                        <small id="emailHelp" className="form-text text-muted">
                            Ví dụ: abc@gmail.com
                        </small>
                    )}
                </div>

                <div className="form-group mb-2 ">
                    <label>Hãy lựa chọn ảnh đại diện cho đội:</label>
                    <div className="table-responsive">
                        <table className="table table-bordered align-middle bg-white">
                            <tbody>
                                {rows.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {row.map((icon) => (
                                            <td key={icon.id}>
                                                <label className="form-check-label me-2" htmlFor={`icon${icon.id}`}>
                                                    <img src={BASE_URL + icon.src} alt={`Icon ${icon.id}`} />
                                                </label>
                                                <input
                                                    type="radio"
                                                    name="icon"
                                                    id={`icon${icon.id}`}
                                                    value={icon.id}
                                                    // eslint-disable-next-line eqeqeq
                                                    checked={formik.values.icon == icon.id}
                                                    onChange={formik.handleChange}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="text-center">
                    <Button type="primary" htmlType="submit" loading={formik.isSubmitting}>
                        Tạo mới (1000 lượng)
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default CreateClan;
