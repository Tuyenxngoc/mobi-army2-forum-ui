import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBellSlash, faBell, faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { Badge, Button, message, Skeleton, Tooltip } from 'antd';
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
import { BASE_RESOURCE_URL } from '~/common/contans';

const cx = classNames.bind(Style);

function PostDetail() {
    const { postId } = useParams();

    const [post, setPost] = useState(null);

    const [isPostLoading, setIsPostLoading] = useState(true);
    const [postErrorMessage, setPostErrorMessage] = useState(null);

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
            message.error('Đã có lỗi xảy ra, vui lòng thử lại');
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
            message.error('Đã có lỗi xảy ra, vui lòng thử lại');
        }
    };

    useEffect(() => {
        const fetchPost = async () => {
            setIsPostLoading(true);
            try {
                if (isNaN(postId)) {
                    throw new Error('ID không hợp lệ. Vui lòng kiểm tra lại.');
                }

                const response = await getPostById(postId);
                setPost(response.data.data);
            } catch (error) {
                if (error.response && error.response.data) {
                    setPostErrorMessage(error.response.data.message);
                } else {
                    setPostErrorMessage(error.message);
                }
            } finally {
                setIsPostLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    return (
        <>
            {isPostLoading ? (
                <>
                    <div className={cx('container')}>
                        <Skeleton active avatar />
                    </div>
                    <div className={cx('ads')}>
                        <Skeleton.Input active size="small" />
                    </div>
                </>
            ) : postErrorMessage ? (
                <div className="alert alert-danger m-2 p-2" role="alert">
                    Lỗi khi tải bài viết: {postErrorMessage}
                </div>
            ) : (
                post && (
                    <>
                        <div className={cx('container')}>
                            <div className={cx('player')}>
                                <img src={BASE_RESOURCE_URL + post.player.avatar} alt="avt" />
                                <div>Bài: {post.player.points}</div>
                            </div>

                            <div className={cx('wrapper')}>
                                <div className={cx('header')}>
                                    <div>
                                        {post.player.isOnline ? <Badge status="success" /> : <Badge status="default" />}
                                        <Link to={`/player/${post.player.id}`} className={cx('username')}>
                                            {post.player.name}
                                        </Link>
                                    </div>

                                    <div className={cx('metadata')}>
                                        <span className={cx('time')}>
                                            <DateFormatter datetime={post.lastModifiedDate} />
                                        </span>
                                        {isAuthenticated && (
                                            <div className={cx('actions')}>
                                                <Button type="primary" size="small" onClick={handleToggleFollowPost}>
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
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className={cx('body')}>
                                    <div className={cx('title')}>{post.title}</div>
                                    <div
                                        className={cx('ql-snow', 'ql-editor', 'content')}
                                        dangerouslySetInnerHTML={{ __html: post.content }}
                                    />
                                    <br />
                                    <div className={cx('like-session')}>
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
        </>
    );
}

export default PostDetail;
