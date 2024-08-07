import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button, Input, message, Select, Space, Table, Tag } from 'antd';
import queryString from 'query-string';

import { INITIAL_FILTERS, INITIAL_META } from '~/common/contans';
import Pagination from '~/components/Pagination';
import { approvePost, deletePost, getPostsForAdmin, toggleLock } from '~/services/postService';

const options = [
    { value: 'title', label: 'Tiêu đề' },
    { value: 'id', label: 'ID' },
    { value: 'player', label: 'Tác giả' },
    { value: 'categoryName', label: 'Tên danh mục' },
    { value: 'approvedBy', label: 'Người duyệt' },
];

const getTagColor = (categoryName) => {
    switch (categoryName) {
        case 'Báo lỗi':
            return 'red';
        case 'Tố cáo':
            return 'gold';
        case 'Góp ý':
            return 'green';
        default:
            return 'default';
    }
};

function PostManagement() {
    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const [posts, setPosts] = useState([]);

    const [searchInput, setSearchInput] = useState('');
    const [activeFilterOption, setActiveFilterOption] = useState(options[0].value);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const [loadingAction, setLoadingAction] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();

    const handleChangePage = (newPage) => {
        setFilters((prev) => ({ ...prev, pageNum: newPage + 1 }));
    };

    const handleChangeRowsPerPage = (event) => {
        setFilters((prev) => ({
            ...prev,
            pageNum: 1,
            pageSize: parseInt(event.target.value, 10),
        }));
    };

    const handleSearch = (searchBy, keyword) => {
        setFilters((prev) => ({
            ...prev,
            pageNum: 1,
            searchBy: searchBy || activeFilterOption,
            keyword: keyword || searchInput,
        }));
    };

    const handleSortChange = (pagination, filters, sorter) => {
        const sortOrder = sorter.order === 'ascend' ? true : sorter.order === 'descend' ? false : undefined;
        setFilters((prev) => ({
            ...prev,
            sortBy: sorter.field,
            isAscending: sortOrder,
        }));
    };

    const handleToggleLockPost = async (postId) => {
        setLoadingAction(true);
        try {
            const response = await toggleLock(postId);
            if (response.status === 200) {
                setPosts((prevPosts) =>
                    prevPosts.map((post) => {
                        if (post.id === postId) {
                            return { ...post, locked: !post.locked };
                        }
                        return post;
                    }),
                );

                messageApi.success(response.data.data.message);
            }
        } catch (error) {
            messageApi.error(error.message);
        } finally {
            setLoadingAction(false);
        }
    };

    const handleApprovePost = async (postId) => {
        setLoadingAction(true);
        try {
            const response = await approvePost(postId);
            if (response.status === 200) {
                setPosts((prevPosts) =>
                    prevPosts.map((post) => {
                        if (post.id === postId) {
                            return { ...post, approved: true };
                        }
                        return post;
                    }),
                );

                messageApi.success(response.data.data.message);
            }
        } catch (error) {
            messageApi.error(error.message);
        } finally {
            setLoadingAction(false);
        }
    };

    const handleDeletePost = async (postId) => {
        setLoadingAction(true);
        try {
            const response = await deletePost(postId);
            if (response.status === 200) {
                setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));

                messageApi.success(response.data.data.message);
            }
        } catch (error) {
            messageApi.error(error.message);
        } finally {
            setLoadingAction(false);
        }
    };

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const params = queryString.stringify(filters);
                const response = await getPostsForAdmin(params);
                const { meta, items } = response.data.data;
                setPosts(items);
                setMeta(meta);
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [filters]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: true,
            showSorterTooltip: false,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            sorter: true,
            showSorterTooltip: false,
            render: (text, record) => <Link to={`/admin/post/${record.id}`}>{text}</Link>,
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            sorter: true,
            showSorterTooltip: false,
            render: (category) =>
                category ? (
                    <Tag color={getTagColor(category.name)}>{category.name}</Tag>
                ) : (
                    <Tag color="default">Chưa có</Tag>
                ),
        },
        {
            title: 'Tác giả',
            dataIndex: 'createdBy',
            key: 'createdBy',
            sorter: true,
            showSorterTooltip: false,
        },
        {
            title: 'Người sửa đổi',
            dataIndex: 'lastModifiedBy',
            key: 'lastModifiedBy',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            key: 'createdDate',
            sorter: true,
            showSorterTooltip: false,
        },
        {
            title: 'Ngày sửa đổi',
            dataIndex: 'lastModifiedDate',
            key: 'lastModifiedDate',
            sorter: true,
            showSorterTooltip: false,
        },
        {
            title: 'Số người theo dõi',
            dataIndex: 'followers',
            key: 'followers',
        },
        {
            title: 'Số bình luận',
            dataIndex: 'comments',
            key: 'comments',
        },
        {
            title: 'Số yêu thích',
            dataIndex: 'favorites',
            key: 'favorites',
        },
        {
            title: 'Số lượt xem',
            dataIndex: 'views',
            key: 'views',
        },
        {
            title: 'Ưu tiên',
            dataIndex: 'priority',
            key: 'priority',
            sorter: true,
            showSorterTooltip: false,
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        danger
                        type="primary"
                        size="small"
                        loading={loadingAction}
                        onClick={() => handleDeletePost(record.id)}
                    >
                        Xóa
                    </Button>
                    {!record.approved ? (
                        <Button
                            type="primary"
                            size="small"
                            loading={loadingAction}
                            onClick={() => handleApprovePost(record.id)}
                        >
                            Duyệt
                        </Button>
                    ) : record.locked ? (
                        <Button
                            type="default"
                            size="small"
                            loading={loadingAction}
                            onClick={() => handleToggleLockPost(record.id)}
                        >
                            Mở Khóa
                        </Button>
                    ) : (
                        <Button
                            type="default"
                            size="small"
                            loading={loadingAction}
                            onClick={() => handleToggleLockPost(record.id)}
                        >
                            Khóa
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    const renderContent = () => {
        if (errorMessage) {
            return (
                <div className="alert alert-danger m-2 p-2" role="alert">
                    Lỗi: {errorMessage}
                </div>
            );
        }

        return (
            <div className="p-2">
                <Table
                    dataSource={posts}
                    columns={columns}
                    size="small"
                    pagination={false}
                    rowKey="id"
                    loading={isLoading}
                    onChange={handleSortChange}
                    scroll={{
                        x: 1500,
                    }}
                />
            </div>
        );
    };

    return (
        <div className="box-container">
            {contextHolder}

            <div className="forum-header">
                <Link to="/forum">Quay lại</Link>
            </div>

            <h3 className="p-2 pb-0"> Quản lý bài viết </h3>

            <div className="p-2">
                <label className="me-2">Trạng thái bài viết</label>
                <Button size="small" disabled={isLoading} onClick={() => handleSearch()}>
                    Tất cả
                </Button>
                <Button size="small" disabled={isLoading} onClick={() => handleSearch('isLocked', 'true')}>
                    Đã khóa
                </Button>
                <Button size="small" disabled={isLoading} onClick={() => handleSearch('isApproved', 'false')}>
                    Chưa duyệt
                </Button>
            </div>

            <Space.Compact className="p-2">
                <Select
                    options={options}
                    disabled={isLoading}
                    value={activeFilterOption}
                    onChange={(value) => setActiveFilterOption(value)}
                />
                <Input
                    allowClear
                    name="searchInput"
                    placeholder="Nhập từ cần tìm..."
                    value={searchInput}
                    disabled={isLoading}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <Button type="primary" loading={isLoading} onClick={() => handleSearch()}>
                    Tìm
                </Button>
            </Space.Compact>

            {renderContent()}

            <Pagination
                totalPages={meta.totalPages || 1}
                currentPage={filters.pageNum - 1}
                rowsPerPage={meta.pageSize}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                isLoading={isLoading}
            />
        </div>
    );
}

export default PostManagement;
