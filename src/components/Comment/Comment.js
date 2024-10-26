import { useState } from 'react';

import TextArea from 'antd/es/input/TextArea';
import { Button, Space } from 'antd';

import Style from './Comment.module.scss';
import classNames from 'classnames/bind';

import useAuth from '~/hooks/useAuth';
import { RESOURCE_URL } from '~/common/commonConstants';
import { ROLES } from '~/common/roleConstants';
import { deleteComment, updateComment } from '~/services/commentService';
import DateFormatter from '../DateFormatter/DateFormatter';
import Player from '../Player/Player';

const cx = classNames.bind(Style);

const allowedRoles = {
    [ROLES.SuperAdmin]: true,
    [ROLES.Admin]: true,
    [ROLES.Moderator]: true,
    [ROLES.Support]: true,
};

function Comment({ data, onUpdateComment, onDeleteComment, message }) {
    const [isLoading, setIsLoading] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(data.content);

    const { player } = useAuth();

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
            const response = await deleteComment(data.id);
            if (response.status === 204) {
                onDeleteComment(data.id);
                message.success(`Đã xóa bình luận có id: ${data.id}`);
            }
        } catch (error) {
            message.error(`Lỗi khi xóa bình luận: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cx('item')}>
            <div className="text-center">
                <img src={RESOURCE_URL + data.player.avatar} className="pixel-art" alt="avt" />
                <div>Bài: {data.player.points}</div>
            </div>

            <div className={cx('container')}>
                <div className={cx('header')}>
                    <div>
                        <Player data={data.player} />
                    </div>

                    <div className="d-flex align-items-center">
                        <i className="d-none d-md-block">
                            <DateFormatter datetime={data.lastModifiedDate} />
                        </i>
                        {canEditOrDelete && (
                            <Space className="ms-2">
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
                                    <Button size="small" onClick={handleEdit} loading={isLoading}>
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
                            </Space>
                        )}
                    </div>
                </div>

                <div className={cx('content')}>
                    {isEditing ? (
                        <TextArea
                            name="content"
                            required
                            rows={2}
                            minLength={3}
                            maxLength={100}
                            disabled={isLoading}
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
