import { useState } from 'react';

import images from '~/assets';

import Style from './Comment.module.scss';
import classNames from 'classnames/bind';

import useAuth from '~/hooks/useAuth';
import { ROLES } from '~/common/contans';
import { deleteComment, updateComment } from '~/services/commentService';
import DateFormatter from '../DateFormatter/DateFormatter';
import TextArea from 'antd/es/input/TextArea';
import { Button } from 'antd';

const cx = classNames.bind(Style);

const allowedRoles = {
    [ROLES.Admin]: true,
    [ROLES.SuperAdmin]: true,
};

function Comment({ data, onUpdateComment, onDeleteComment, message }) {
    const { player } = useAuth();

    const [isLoading, setIsLoading] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(data.content);

    const canEditOrDelete = allowedRoles[player.roleName];

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleInputChange = (event) => {
        setEditedContent(event.target.value);
    };

    const handleSaveEditComment = async () => {
        if (editedContent === data.content) {
            message.info('Không có thay đổi nào để cập nhật.');
            setIsEditing(false);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        const values = {
            content: editedContent,
        };
        try {
            const response = await updateComment(data.id, values);
            onUpdateComment(response.data.data);
            message.success(`Đã cập nhật bình luận có id: ${data.id}`);
        } catch (error) {
            message.error(`Lỗi khi cập nhật bình luận: ${error.message}`);
        } finally {
            setIsEditing(false);
            setIsLoading(false);
        }
    };

    const handleDeleteComment = async () => {
        setIsLoading(true);
        try {
            await deleteComment(data.id);
            onDeleteComment(data.id);
            message.success(`Đã xóa bình luận có id: ${data.id}`);
        } catch (error) {
            message.error(`Lỗi khi xóa bình luận: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cx('comment-item')}>
            <div className="text-center">
                <img src={images.plGif} alt="status" />
                <div>Bài: 1</div>
            </div>

            <div className={cx('comment-body')}>
                <div className={cx('comment-header')}>
                    <div>
                        <img src={data.player.isOnline ? images.online : images.offline} alt="status" />
                        <span className={cx('username')}>{data.player.name}</span>
                    </div>

                    <div className={cx('comment-metadata')}>
                        <span className={cx('time')}>
                            <DateFormatter datetime={data.lastModifiedDate} />
                        </span>
                        {canEditOrDelete && (
                            <div className={cx('comment-actions', 'ms-2')}>
                                {isEditing ? (
                                    <Button
                                        size="small"
                                        type="primary"
                                        onClick={handleSaveEditComment}
                                        loading={isLoading}
                                    >
                                        Lưu
                                    </Button>
                                ) : (
                                    <Button size="small" type="default" onClick={handleEdit} loading={isLoading}>
                                        Sửa
                                    </Button>
                                )}
                                <Button
                                    danger
                                    size="small"
                                    type="primary"
                                    onClick={handleDeleteComment}
                                    loading={isLoading}
                                >
                                    Xóa
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className={cx('comment-content')}>
                    {isEditing ? (
                        <TextArea
                            required
                            rows={2}
                            maxLength={255}
                            value={editedContent}
                            onChange={handleInputChange}
                        />
                    ) : (
                        data.content
                    )}
                    <br />
                    <br />
                </div>
            </div>
        </div>
    );
}

export default Comment;
