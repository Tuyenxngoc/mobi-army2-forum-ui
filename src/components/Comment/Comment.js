import { useState } from 'react';

import images from '~/assets';

import Style from './Comment.module.scss';
import classNames from 'classnames/bind';

import useAuth from '~/hooks/useAuth';
import { ROLES } from '~/common/contans';
import { deleteComment, updateComment } from '~/services/commentService';
import DateFormatter from '../DateFormatter/DateFormatter';

const cx = classNames.bind(Style);

const allowedRoles = {
    [ROLES.Admin]: true,
    [ROLES.SuperAdmin]: true,
};

function Comment({ data }) {
    const { player } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(data.content);

    const canEditOrDelete = allowedRoles[player.roleName];

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSaveEdit = () => {
        const values = {
            content: editedContent,
        };
        updateComment(data.id, values)
            .then(() => {
                alert(`Updated comment with id: ${data.id}`);
            })
            .catch((err) => {
                console.error('Failed to update comment:', err);
            })
            .finally(() => {
                setIsEditing(false);
            });
    };

    const handleDelete = () => {
        deleteComment(data.id)
            .then(() => {
                alert(`Delete comment with id: ${data.id}`);
            })
            .catch((err) => {
                console.error('Failed to update comment:', err);
            });
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
                        <textarea
                            value={editedContent}
                            onChange={handleInputChange}
                            onBlur={handleSaveEdit}
                            className={cx('edit-textarea')}
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
                    <button onClick={handleDelete}>Delete</button>
                </div>
            )}
        </div>
    );
}

export default Comment;
