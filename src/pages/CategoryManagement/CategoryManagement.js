import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button, Input, message, Select, Space, Table } from 'antd';
import queryString from 'query-string';

import { INITIAL_FILTERS, INITIAL_META } from '~/common/contans';
import Pagination from '~/components/Pagination';
import { deleteCategory, getCategoriesForAdmin } from '~/services/categoryService';

const options = [
    { value: 'id', label: 'ID' },
    { value: 'name', label: 'Tên' },
];

function CategoryManagement() {
    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const [categories, setCategories] = useState([]);

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

    const handleSearch = () => {
        setFilters((prev) => ({
            ...prev,
            pageNum: 1,
            searchBy: activeFilterOption,
            keyword: searchInput,
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

    const handleDeleteCategory = async (categoryId) => {
        setLoadingAction(true);
        try {
            const response = await deleteCategory(categoryId);
            if (response.status === 200) {
                setCategories((prevCates) => prevCates.filter((cate) => cate.id !== categoryId));
            }
        } catch (error) {
            messageApi.error(error.message);
        } finally {
            setLoadingAction(false);
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const params = queryString.stringify(filters);
                const response = await getCategoriesForAdmin(params);
                const { meta, items } = response.data.data;
                setCategories(items);
                setMeta(meta);
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
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
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            showSorterTooltip: false,
            render: (text, record) => <Link to={`/admin/category/${record.id}`}>{text}</Link>,
        },
        {
            title: 'Tạo bởi',
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
            title: 'Số bài viết',
            dataIndex: 'postCount',
            key: 'postCount',
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
                        onClick={() => handleDeleteCategory(record.id)}
                    >
                        Xóa
                    </Button>
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
                    rowKey="id"
                    size="small"
                    columns={columns}
                    dataSource={categories}
                    pagination={false}
                    loading={isLoading}
                    onChange={handleSortChange}
                    scroll={{
                        x: 1000,
                    }}
                />
            </div>
        );
    };

    return (
        <>
            {contextHolder}

            <h3 className="p-2 pb-0"> Quản lý danh mục </h3>

            <div className="p-2">
                <Link to="/admin/category/new">Thêm mới</Link>
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
        </>
    );
}

export default CategoryManagement;