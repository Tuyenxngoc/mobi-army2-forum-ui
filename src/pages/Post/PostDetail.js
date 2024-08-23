import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBellSlash, faBell, faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { Button, message, Skeleton, Tooltip } from 'antd';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.core.css';
import classNames from 'classnames/bind';
import Style from './PostDetail.module.scss';

import images from '~/assets';
import { getPostById, toggleFollow } from '~/services/postService';
import { toggleLike } from '~/services/likeService';
import useAuth from '~/hooks/useAuth';
import DateFormatter from '~/components/DateFormatter/DateFormatter';
import CommentsSection from './CommentsSection';
import { BASE_URL } from '~/common/commonConstants';
import { checkIdIsNumber } from '~/utils/helper';
import Player from '~/components/Player/Player';

const cx = classNames.bind(Style);

function PostDetail() {
    const navigate = useNavigate();
    const { postId } = useParams();

    const [post, setPost] = useState(null);

    const [isPostLoading, setIsPostLoading] = useState(true);
    const [postErrorMessage, setPostErrorMessage] = useState(null);

    const [messageApi, contextHolder] = message.useMessage();
    const { isAuthenticated } = useAuth();

    const handleToggleLikePost = async () => {
        try {
            const response = await toggleLike(postId);
            if (response.status === 200) {
                setPost((prev) => ({
                    ...prev,
                    like: {
                        ...prev.like,
                        hasLikes: !prev.like.hasLikes,
                        likeCount: prev.like.hasLikes ? prev.like.likeCount - 1 : prev.like.likeCount + 1,
                        latestLiker: !prev.like.hasLikes ? 'Bạn' : prev.like.latestLiker,
                    },
                }));
            }
        } catch (error) {
            messageApi.error('Đã có lỗi xảy ra, vui lòng thử lại');
        }
    };

    const handleToggleFollowPost = async () => {
        try {
            const response = await toggleFollow(postId);
            if (response.status === 200) {
                setPost((prev) => ({
                    ...prev,
                    followed: !prev.followed,
                }));
            }
        } catch (error) {
            messageApi.error('Đã có lỗi xảy ra, vui lòng thử lại');
        }
    };

    useEffect(() => {
        if (!checkIdIsNumber(postId)) {
            navigate('/forum');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postId]);

    useEffect(() => {
        const fetchPost = async () => {
            setIsPostLoading(true);
            setPostErrorMessage(null);
            try {
                if (!checkIdIsNumber(postId)) {
                    return;
                }
                const response = await getPostById(postId);
                setPost(response.data.data);
            } catch (error) {
                setPostErrorMessage(error.response?.data?.message || error.message);
            } finally {
                setIsPostLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    return (
        <div className="box-container">
            {contextHolder}

            <div className="header">
                <Link to="/forum">Quay lại</Link>
            </div>

            {isPostLoading ? (
                <>
                    <div className="p-2">
                        <Skeleton active avatar />
                    </div>
                    <div className={cx('ads')}>
                        <Skeleton.Input active size="small" />
                    </div>
                </>
            ) : postErrorMessage ? (
                <div className="alert alert-danger m-2 p-2" role="alert">
                    Lỗi : {postErrorMessage}
                </div>
            ) : (
                post && (
                    <>
                        <div className="d-flex align-items-start p-2">
                            <div className="text-center">
                                <img src={BASE_URL + post.player.avatar} className="pixel-art" alt="avt" />
                                <div>Bài: {post.player.points}</div>
                            </div>

                            <div className={cx('wrapper')}>
                                <div className={cx('header')}>
                                    <div>
                                        <Player data={post.player} />
                                    </div>

                                    <div className="d-flex align-items-center">
                                        <i className="d-none d-md-block">
                                            <DateFormatter datetime={post.lastModifiedDate} />
                                        </i>
                                        {isAuthenticated && (
                                            <Button
                                                className="ms-2"
                                                type="primary"
                                                size="small"
                                                onClick={handleToggleFollowPost}
                                            >
                                                {post.followed ? (
                                                    <>
                                                        <FontAwesomeIcon icon={faBellSlash} />
                                                        {' Bỏ theo dõi'}
                                                    </>
                                                ) : (
                                                    <>
                                                        <FontAwesomeIcon icon={faBell} />
                                                        {' Theo dõi'}
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className="fw-bold">{post.title}</div>
                                    <div
                                        className="ql-snow ql-editor p-0"
                                        dangerouslySetInnerHTML={{ __html: post.content }}
                                    />
                                    <br />
                                    <div className="d-flex justify-content-between align-items-center">
                                        {isAuthenticated && (
                                            <Tooltip title={post.like.hasLikes ? 'Bỏ thích' : 'Thích'}>
                                                <div className="text-danger" onClick={handleToggleLikePost}>
                                                    <FontAwesomeIcon
                                                        icon={post.like.hasLikes ? faHeartSolid : faHeartRegular}
                                                    />
                                                </div>
                                            </Tooltip>
                                        )}

                                        {post.like.likeCount > 0 && (
                                            <div className={cx('like-count')}>
                                                <span className="text-danger"> ♥ </span>
                                                {`${post.like.latestLiker}${
                                                    post.like.likeCount === 1
                                                        ? ' đã thích bài này'
                                                        : ` và ${post.like.likeCount - 1} người khác đã thích bài này`
                                                }`}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={cx('ads')}>
                            <img src={images.newGif} alt="new" />
                            <Link to="/">Avatar Bùm</Link>
                            <img src={images.newGif} alt="new" />
                        </div>
                    </>
                )
            )}
            {post && <CommentsSection postId={postId} postLocked={post.locked} />}
        </div>
    );
}

export default PostDetail;
