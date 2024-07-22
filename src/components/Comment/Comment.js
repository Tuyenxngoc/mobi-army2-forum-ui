import { useState } from 'react';

import images from '~/assets';

import Style from './Comment.module.scss';
import classNames from 'classnames/bind';

import useAuth from '~/hooks/useAuth';
import { ROLES } from '~/common/contans';
import { deleteComment, updateComment } from '~/services/commentService';
import DateFormatter from '../DateFormatter/DateFormatter';
import TextArea from 'antd/es/input/TextArea';

const cx = classNames.bind(Style);

const allowedRoles = {
    [ROLES.Admin]: true,
    [ROLES.SuperAdmin]: true,
};

function Comment({ data, onUpdateComment, onDeleteComment, message }) {
    const { player } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(data.content);

    const canEditOrDelete = allowedRoles[player.roleName];

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSaveEditComment = async () => {
        const values = {
            content: editedContent,
        };
        try {
            const response = await updateComment(data.id, values);
            onUpdateComment(response.data.data);
            message.success(`Đã cập nhật bình luận có id: ${data.id}`);
        } catch (err) {
            console.error('Failed to update comment:', err);
        } finally {
            setIsEditing(false);
        }
    };

    const handleDeleteComment = async () => {
        try {
            await deleteComment(data.id);
            onDeleteComment(data.id);
            message.success(`Đã xóa bình luận có id: ${data.id}`);
        } catch (err) {
            console.error('Failed to delete comment:', err);
        }
    };

    const handleInputChange = (event) => {
        setEditedContent(event.target.value);
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

                    <div>
                        <span className={cx('time')}>
                            <DateFormatter datetime={data.lastModifiedDate} />
                        </span>
                    </div>
                </div>

                <div className={cx('comment-content')}>
                    {isEditing ? (
                        <TextArea
                            rows={2}
                            value={editedContent}
                            onChange={handleInputChange}
                            onBlur={handleSaveEditComment}
                            maxLength={255}
                            required
                        />
                    ) : (
                        <div onDoubleClick={handleEdit}>{data.content}</div>
                    )}
                    <br />
                    <br />
                </div>
            </div>

            {canEditOrDelete && (
                <div className={cx('comment-actions')}>
                    <button onClick={handleEdit}>Edit</button>
                    <button onClick={handleDeleteComment}>Delete</button>
                </div>
            )}
        </div>
    );
}

export default Comment;
