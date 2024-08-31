import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import queryString from 'query-string';
import { Button, Input, Select, Space, Table } from 'antd';

import Pagination from '~/components/Pagination/Pagination';
import { INITIAL_FILTERS, INITIAL_META } from '~/common/commonConstants';
import { getPlayersByGiftCode } from '~/services/giftCodeService';
import { checkIdIsNumber } from '~/utils/helper';

const options = [
    { value: 'playerId', label: 'ID' },
    { value: 'username', label: 'Tên' },
];

function PlayerGiftCodeUsage() {
    const navigate = useNavigate();
    const { giftCodeId } = useParams();

    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const [players, setPlayers] = useState([]);

    const [searchInput, setSearchInput] = useState('');
    const [activeFilterOption, setActiveFilterOption] = useState(options[0].value);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

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

    useEffect(() => {
        if (!checkIdIsNumber(giftCodeId)) {
            navigate('/admin/giftcode', { replace: true });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const fetchPlayers = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                if (!checkIdIsNumber(giftCodeId)) return;

                const params = queryString.stringify(filters);
                const response = await getPlayersByGiftCode(giftCodeId, params);
                const { meta, items } = response.data.data;
                setPlayers(items);
                setMeta(meta);
            } catch (error) {
                setErrorMessage(error.response?.data?.message || error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlayers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            dataIndex: 'username',
            key: 'username',
            sorter: true,
            showSorterTooltip: false,
            render: (text, record) => <Link to={`/player/${record.playerId}`}>{text}</Link>,
        },
        {
            title: 'Ngày sử dụng',
            dataIndex: 'redeemTime',
            key: 'redeemTime',
            sorter: true,
            showSorterTooltip: false,
        },
    ];

    const renderContent = () => {
        if (errorMessage) {
            return (
                <div className="alert alert-danger p-2" role="alert">
                    Lỗi: {errorMessage}
                </div>
            );
        }

        return (
            <Table
                rowKey="id"
                size="small"
                columns={columns}
                dataSource={players}
                pagination={false}
                loading={isLoading}
                onChange={handleSortChange}
                scroll={{
                    x: 500,
                }}
            />
        );
    };

    return (
        <div className="box-container">
            <div className="header">
                <Link to={`/admin/giftcode/${giftCodeId}`}>Quay lại</Link>
            </div>

            <div className="p-2">
                <h4 className="title">Danh sách người chơi đã sử dụng mã quà tặng</h4>

                <Space.Compact className="mb-2">
                    <Select
                        options={options}
                        disabled={isLoading}
                        value={activeFilterOption}
                        onChange={(value) => setActiveFilterOption(value)}
                    />
                    <Input
                        name="searchInput"
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
            </div>

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

export default PlayerGiftCodeUsage;
