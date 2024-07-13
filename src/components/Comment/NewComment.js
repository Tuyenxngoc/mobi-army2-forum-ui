import PropTypes from 'prop-types';
import React, { useState } from 'react';

import classNames from 'classnames/bind';
import Style from './Comment.module.scss';
import { createComment } from '~/services/commentService';

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
        } catch (err) {
            console.log('Failed to submit comment');
        }
    };

    return (
        <form onSubmit={handleCommentSubmit} className={cx('comment-form')}>
            <textarea value={newComment} onChange={handleCommentChange} placeholder="Write a comment..." required />
            <button type="submit">Submit</button>
        </form>
    );
}

NewComment.propTypes = {
    postId: PropTypes.string.isRequired,
    onCommentSubmit: PropTypes.func.isRequired,
};

export default NewComment;
