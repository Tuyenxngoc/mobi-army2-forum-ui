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
import { deleteNotification, updateNotification } from '~/services/notificationService';
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

const Notification = ({ data, onNotificationUpdate, onNotificationDelete, canEdit = false, messageApi, className }) => {
    const [editing, setEditing] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteDialogText, setDeleteDialogText] = useState(
        'Bạn có chắc muốn xóa thông báo này? Lưu ý: Sau khi xóa, bạn không thể hoàn tác hay khôi phục.',
    );

    const handleNotificationUpdate = async (values, { setSubmitting }) => {
        if (values.title === data.title && values.content === data.content) {
            messageApi.info('Không có thay đổi nào để cập nhật.');
            setSubmitting(false);
            setEditing(false);
            return;
        }
        try {
            const response = await updateNotification(data.id, values);
            messageApi.success('Sửa thông báo thành công');
            onNotificationUpdate(response.data.data);
            setEditing(false);
        } catch (error) {
            messageApi.error('Thêm thông báo thất bại: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const formik = useFormik({
        initialValues: defaultValue,
        validationSchema: validationSchema,
        onSubmit: handleNotificationUpdate,
    });

    const handleNotificationDelete = async () => {
        setDeleteLoading(true);
        setDeleteDialogText('Đang xóa...');

        try {
            const response = await deleteNotification(data.id);
            if (response.status === 204) {
                messageApi.success('Xoá thông báo thành công');
                setShowDeleteDialog(false);
                setDeleteLoading(false);
                onNotificationDelete(data.id);
            }
        } catch (error) {
            setDeleteDialogText('Xóa thất bại. Vui lòng thử lại.');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleEditButtonClick = () => {
        setEditing(true);
    };

    const handleDeleteButtonClick = () => {
        setShowDeleteDialog(true);
    };

    const handleCloseEditButtonClick = () => {
        setEditing(false);
    };

    const handleCloseDeleteDialogClick = () => {
        setShowDeleteDialog(false);
    };

    useEffect(() => {
        if (editing) {
            formik.setValues({
                title: data.title,
                content: data.content,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editing]);

    return (
        <>
            <Modal
                title="Xác nhận xóa"
                open={showDeleteDialog}
                onOk={handleNotificationDelete}
                confirmLoading={deleteLoading}
                onCancel={handleCloseDeleteDialogClick}
            >
                <p>{deleteDialogText}</p>
            </Modal>

            <div className={classNames('box-container p-2', className)}>
                {editing ? (
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
                        <ReactQuill
                            className="custom-quill"
                            value={formik.values.content}
                            modules={modules}
                            formats={formats}
                            onChange={(value) => formik.setFieldValue('content', value)}
                        />
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
                                                cursor: deleteLoading ? 'not-allowed' : 'pointer',
                                                opacity: deleteLoading ? 0.5 : 1,
                                            }}
                                            onClick={deleteLoading ? null : handleEditButtonClick}
                                        >
                                            <FontAwesomeIcon icon={faPen} />
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            cursor: deleteLoading ? 'not-allowed' : 'pointer',
                                            opacity: deleteLoading ? 0.5 : 1,
                                        }}
                                        onClick={deleteLoading ? null : handleDeleteButtonClick}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </div>
                                </>
                            ) : (
                                <h4>{data.title}</h4>
                            )}
                        </div>

                        <div
                            className="ql-snow ql-editor p-0 custom-text-primary"
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
    className: PropTypes.string,
};

export default Notification;
