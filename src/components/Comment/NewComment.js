import PropTypes from 'prop-types';
import { useState } from 'react';

import TextArea from 'antd/es/input/TextArea';
import { Button, Space } from 'antd';

import classNames from 'classnames/bind';
import Style from './Comment.module.scss';

import { createComment } from '~/services/commentService';
import { RESOURCE_URL } from '~/common/commonConstants';
import useAuth from '~/hooks/useAuth';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

const cx = classNames.bind(Style);

function NewComment({ postId, onCommentSubmit, message }) {
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const { player } = useAuth();

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleEmojiSelect = (emoji) => {
        setNewComment(newComment + emoji.native);
        setShowEmojiPicker(false);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await createComment(postId, { content: newComment });
            if (response.status === 201) {
                onCommentSubmit(response.data.data);
                setNewComment('');
            }
        } catch (error) {
            message.error(`Lỗi khi tạo bình luận: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cx('item')}>
            <div>
                <img src={RESOURCE_URL + player.avatar} className="pixel-art" alt="avt" />
            </div>

            <form className={cx('container')} onSubmit={handleCommentSubmit}>
                <TextArea
                    name="content"
                    required
                    rows={2}
                    minLength={3}
                    maxLength={100}
                    disabled={isLoading}
                    value={newComment}
                    onChange={handleCommentChange}
                />

                <Space className="mt-2">
                    <Button size="small" htmlType="submit" type="primary" loading={isLoading}>
                        Gửi
                    </Button>
                    <Button size="small" type="default" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                        😊
                    </Button>
                </Space>

                {showEmojiPicker && (
                    <div className={cx('emoji-picker')}>
                        <Picker data={data} onEmojiSelect={handleEmojiSelect} locale="vi" />
                    </div>
                )}
            </form>
        </div>
    );
}

NewComment.propTypes = {
    postId: PropTypes.string.isRequired,
    onCommentSubmit: PropTypes.func.isRequired,
    message: PropTypes.object.isRequired,
};

export default NewComment;
