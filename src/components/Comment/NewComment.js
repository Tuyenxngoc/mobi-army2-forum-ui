import PropTypes from 'prop-types';
import React, { useState } from 'react';

import classNames from 'classnames/bind';
import Style from './Comment.module.scss';
import { createComment } from '~/services/commentService';
import images from '~/assets';
import TextArea from 'antd/es/input/TextArea';

const cx = classNames.bind(Style);

function NewComment({ postId, onCommentSubmit }) {
    const [newComment, setNewComment] = useState('');

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await createComment({ postId, content: newComment });
            if (response.status === 200) {
                onCommentSubmit(response.data.data);
                setNewComment('');
            }
        } catch (error) {
            console.log('Failed to submit comment');
        }
    };

    return (
        <div className={cx('comment-item')} style={{ padding: '5px' }}>
            <div className="text-center">
                <img src={images.plGif} alt="status" />
                <div>Bài: 1</div>
            </div>

            <form onSubmit={handleCommentSubmit} className={cx('comment-body')}>
                <TextArea rows={2} value={newComment} onChange={handleCommentChange} maxLength={255} required />
                <button type="submit" className="p-x mt-2">
                    Gửi
                </button>
            </form>
        </div>
    );
}

NewComment.propTypes = {
    postId: PropTypes.string.isRequired,
    onCommentSubmit: PropTypes.func.isRequired,
};

export default NewComment;
