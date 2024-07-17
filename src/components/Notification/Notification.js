import { useCallback, useRef, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faPen, faXmark } from '@fortawesome/free-solid-svg-icons';
import { message, Modal } from 'antd';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.core.css';
import ReactQuill from 'react-quill';
import DateFormatter from '../DateFormatter/DateFormatter';
import { deleteNotification, updateNotification } from '~/services/NotificationService';

import Style from './Notification.module.scss';
import classNames from 'classnames/bind';
import { formats, modules } from '~/common/editorConfig';

const cx = classNames.bind(Style);

const Notification = ({ data, fetchNotifications, canEdit = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(data.title);
    const [editedContent, setEditedContent] = useState(data.content);
    const [showDialogDelete, setShowDialogDelete] = useState(false);
    const reactQuillRef = useRef(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState(
        'Bạn có chắc muốn xóa thông báo này? Lưu ý: Sau khi xóa, bạn không thể hoàn tác hay khôi phục.',
    );
    const [messageApi, contextHolder] = message.useMessage();

    const handleEdit = () => {
        setIsEditing(true);
        setEditedTitle(data.title);
        setEditedContent(data.content);
    };

    const handleBtnDeleteClick = () => {
        setShowDialogDelete(true);
    };

    const handleBtnCloseClick = () => {
        setIsEditing(false);
    };

    const handleChangeNotification = () => {
        const newValues = {
            title: editedTitle,
            content: editedContent,
        };
        updateNotification(data.notificationId, newValues)
            .then(() => {
                fetchNotifications();
                messageApi.success('Save changes successfully');
            })
            .catch(() => {});
    };

    const handleDelete = () => {
        setModalText('Đang xóa...');
        setConfirmLoading(true);
        deleteNotification(data.id)
            .then(() => {
                setShowDialogDelete(false);
                setConfirmLoading(false);
                fetchNotifications();
            })
            .catch(() => {
                setModalText('Xóa thất bại. Vui lòng thử lại.');
                setConfirmLoading(false);
            });
    };

    const handleCancel = () => {
        setShowDialogDelete(false);
    };

    return (
        <>
            {contextHolder}

            <Modal
                title="Xác nhận xóa"
                open={showDialogDelete}
                onOk={handleDelete}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <p>{modalText}</p>
            </Modal>

            <div className="box-container p-2">
                {isEditing ? (
                    <>
                        <div className={cx('title')}>
                            <input
                                type="text"
                                className="form-control-plaintext"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                            />
                            <div className="d-flex">
                                <div onClick={handleBtnCloseClick}>
                                    <FontAwesomeIcon icon={faXmark} />
                                </div>
                                <div onClick={handleChangeNotification}>
                                    <FontAwesomeIcon icon={faFloppyDisk} />
                                </div>
                            </div>
                        </div>
                        <div className={cx('content')}>
                            <ReactQuill
                                id="formControlTextarea"
                                ref={reactQuillRef}
                                theme="snow"
                                modules={modules}
                                formats={formats}
                                value={editedContent}
                                onChange={(value) => setEditedContent(value)}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className={cx('title')}>
                            <div className="d-flex">
                                <h4>{data.title}</h4>
                                {canEdit && (
                                    <div className={cx('editButton')} onClick={handleEdit}>
                                        <FontAwesomeIcon icon={faPen} />
                                    </div>
                                )}
                            </div>
                            {canEdit && (
                                <div onClick={handleBtnDeleteClick}>
                                    <FontAwesomeIcon icon={faXmark} />
                                </div>
                            )}
                        </div>
                        <div
                            className={cx('ql-editor', 'content')}
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

export default Notification;
