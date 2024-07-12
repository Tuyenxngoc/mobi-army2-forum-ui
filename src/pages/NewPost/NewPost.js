import React, { useState, useEffect } from 'react';
import { getAllCategories } from '~/services/categoryService';
import { createPost } from '~/services/postService';

function NewPost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState(0);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Call API to fetch categories
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await getAllCategories();
            setCategories(response.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error.message);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Đoạn code gửi dữ liệu lên server
        const postData = { title, content, categoryId };

        try {
            const response = await createPost(postData);

            // Handle success, e.g., redirect or show success message
            console.log('New post created successfully!', response);
        } catch (error) {
            console.error('Error creating new post:', error.message);
            // Handle error, e.g., show error message to user
        }
    };

    return (
        <div>
            <h1>Create New Post</h1>
            <form onSubmit={handleSubmit}>
                <label>Title:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <br />
                <label>Content:</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
                <br />
                <label>Category:</label>
                <select value={categoryId} onChange={(e) => setCategoryId(parseInt(e.target.value))} required>
                    <option value="">Select category...</option>
                    {categories.map((category) => (
                        <option key={category.categoryId} value={category.categoryId}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <br />
                <button type="submit">Create Post</button>
            </form>
        </div>
    );
}

export default NewPost;
