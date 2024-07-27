import PropTypes from 'prop-types';
import { useState } from 'react';

import TextArea from 'antd/es/input/TextArea';
import { Button } from 'antd';

import classNames from 'classnames/bind';
import Style from './Comment.module.scss';

import images from '~/assets';
import { createComment } from '~/services/commentService';

const cx = classNames.bind(Style);

function NewComment({ postId, onCommentSubmit, message }) {
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await createComment(postId, { content: newComment });
            if (response.status === 200) {
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
            <div className={cx('player')}>
                <img src={images.plGif} alt="avt" />
                <div>Bài: 1</div>
            </div>

            <form className={cx('container')} onSubmit={handleCommentSubmit}>
                <TextArea
                    required
                    rows={2}
                    maxLength={255}
                    disabled={isLoading}
                    value={newComment}
                    onChange={handleCommentChange}
                />
                <Button htmlType="submit" type="primary" className="mt-2" loading={isLoading}>
                    Gửi
                </Button>
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
