import React, { useState, useEffect } from 'react';
import { getPostsForReview, approvePost, deletePost } from '~/services/postService.js';

const ReviewPosts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        getPostsForReview()
            .then((response) => {
                const { meta, items } = response.data.data;
                setPosts(items);
            })
            .catch((error) => {
                console.error('Có lỗi xảy ra:', error);
            });
    }, []);

    const handleApprove = (postId) => {
        approvePost(postId)
            .then((response) => {
                setPosts(posts.filter((post) => post.id !== postId));
                alert('Duyệt thành công');
            })
            .catch((error) => {
                console.error('Có lỗi xảy ra:', error);
            });
    };

    const handleRemove = (postId) => {
        deletePost(postId)
            .then((response) => {
                setPosts(posts.filter((post) => post.id !== postId));
                alert('Xóa thành công');
            })
            .catch((error) => {
                console.error('Có lỗi xảy ra:', error);
            });
    };

    return (
        <div>
            <h1>Duyệt bài viết</h1>
            {posts.length === 0 ? (
                <p>Không có bài viết nào cần duyệt.</p>
            ) : (
                <ul>
                    {posts.map((post) => (
                        <li key={post.id}>
                            <h2>{post.title}</h2>
                            <p>{post.content}</p>
                            <button onClick={() => handleApprove(post.id)}>Duyệt</button>
                            <button onClick={() => handleRemove(post.id)}>Xóa</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ReviewPosts;
