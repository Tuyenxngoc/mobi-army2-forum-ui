import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faPen, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.core.css';
import classNames from 'classnames/bind';
import Style from './Notification.module.scss';
import DateFormatter from '../DateFormatter/DateFormatter';
import { deleteNotification, updateNotification } from '~/services/NotificationService';
import { formats, modules } from '~/common/editorConfig';

const cx = classNames.bind(Style);

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

const Notification = ({ data, onNotificationUpdate, onNotificationDelete, canEdit = false, messageApi }) => {
    const [isEditingNotification, setIsEditingNotification] = useState(false);
    const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
    const [isDeleteConfirmLoading, setIsDeleteConfirmLoading] = useState(false);
    const [deleteDialogText, setDeleteDialogText] = useState(
        'Bạn có chắc muốn xóa thông báo này? Lưu ý: Sau khi xóa, bạn không thể hoàn tác hay khôi phục.',
    );

    const formik = useFormik({
        initialValues: defaultValue,
        validationSchema: validationSchema,
        onSubmit: handleNotificationUpdate,
    });

    async function handleNotificationUpdate(values, { setSubmitting }) {
        if (values.title === data.title && values.content === data.content) {
            messageApi.info('Không có thay đổi nào để cập nhật.');
            setSubmitting(false);
            setIsEditingNotification(false);
            return;
        }
        try {
            const response = await updateNotification(data.id, values);
            messageApi.success('Sửa thông báo thành công');
            onNotificationUpdate(response.data.data);
            setIsEditingNotification(false);
        } catch (error) {
            messageApi.error('Thêm thông báo thất bại: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    }

    const handleNotificationDelete = async () => {
        setIsDeleteConfirmLoading(true);
        setDeleteDialogText('Đang xóa...');

        try {
            await deleteNotification(data.id);
            messageApi.success('Xoá thông báo thành công');
            setIsDeleteDialogVisible(false);
            setIsDeleteConfirmLoading(false);
            onNotificationDelete(data.id);
        } catch (error) {
            setDeleteDialogText('Xóa thất bại. Vui lòng thử lại.');
        } finally {
            setIsDeleteConfirmLoading(false);
        }
    };

    const handleEditButtonClick = () => {
        setIsEditingNotification(true);
    };

    const handleDeleteButtonClick = () => {
        setIsDeleteDialogVisible(true);
    };

    const handleCloseEditButtonClick = () => {
        setIsEditingNotification(false);
    };

    const handleCloseDeleteDialogClick = () => {
        setIsDeleteDialogVisible(false);
    };

    useEffect(() => {
        if (isEditingNotification) {
            formik.setValues({
                title: data.title,
                content: data.content,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditingNotification]);

    return (
        <>
            <Modal
                title="Xác nhận xóa"
                open={isDeleteDialogVisible}
                onOk={handleNotificationDelete}
                confirmLoading={isDeleteConfirmLoading}
                onCancel={handleCloseDeleteDialogClick}
            >
                <p>{deleteDialogText}</p>
            </Modal>

            <div className="box-container p-2">
                {isEditingNotification ? (
                    <>
                        <div className={cx('title')}>
                            <div className="form-group">
                                <input
                                    id="inputTitle"
                                    className={`form-control-plaintext ${
                                        formik.touched.title && formik.errors.title ? 'is-invalid' : ''
                                    }`}
                                    aria-describedby="titleHelp"
                                    type="text"
                                    name="title"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />

                                {formik.touched.title && formik.errors.title ? (
                                    <div className="invalid-feedback">{formik.errors.title}</div>
                                ) : (
                                    <small id="titleHelp" className="form-text text-muted">
                                        Tiêu đề thông báo không nên quá ngắn
                                    </small>
                                )}
                            </div>

                            <div className={cx('edit-action')}>
                                <div
                                    className="me-2"
                                    style={{
                                        cursor: formik.isSubmitting ? 'not-allowed' : 'pointer',
                                        opacity: formik.isSubmitting ? 0.5 : 1,
                                    }}
                                    onClick={formik.isSubmitting ? null : handleCloseEditButtonClick}
                                >
                                    <FontAwesomeIcon icon={faXmark} />
                                </div>
                                <div
                                    style={{
                                        cursor: formik.isSubmitting ? 'not-allowed' : 'pointer',
                                        opacity: formik.isSubmitting ? 0.5 : 1,
                                    }}
                                    onClick={formik.isSubmitting ? null : formik.handleSubmit}
                                >
                                    <FontAwesomeIcon icon={faFloppyDisk} />
                                </div>
                            </div>
                        </div>
                        <div className={cx('content')}>
                            <ReactQuill
                                id="inputContent"
                                className="custom-quill"
                                value={formik.values.content}
                                modules={modules}
                                formats={formats}
                                onChange={(value) => formik.setFieldValue('content', value)}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className={cx('title')}>
                            {canEdit ? (
                                <>
                                    <div className="d-flex align-items-center">
                                        <h4 className="me-2">{data.title}</h4>
                                        <div
                                            style={{
                                                cursor: isDeleteConfirmLoading ? 'not-allowed' : 'pointer',
                                                opacity: isDeleteConfirmLoading ? 0.5 : 1,
                                            }}
                                            onClick={isDeleteConfirmLoading ? null : handleEditButtonClick}
                                        >
                                            <FontAwesomeIcon icon={faPen} />
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            cursor: isDeleteConfirmLoading ? 'not-allowed' : 'pointer',
                                            opacity: isDeleteConfirmLoading ? 0.5 : 1,
                                        }}
                                        onClick={isDeleteConfirmLoading ? null : handleDeleteButtonClick}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </div>
                                </>
                            ) : (
                                <h4>{data.title}</h4>
                            )}
                        </div>

                        <div
                            className={cx('ql-snow', 'ql-editor', 'content')}
                            dangerouslySetInnerHTML={{ __html: data.content }}
                        />

                        <div className={cx('date')}>
                            <DateFormatter datetime={data.lastModifiedDate} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

Notification.propTypes = {
    data: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        lastModifiedDate: PropTypes.string.isRequired,
    }).isRequired,
    onNotificationUpdate: PropTypes.func.isRequired,
    onNotificationDelete: PropTypes.func.isRequired,
    canEdit: PropTypes.bool,
    messageApi: PropTypes.object.isRequired,
};

export default Notification;
