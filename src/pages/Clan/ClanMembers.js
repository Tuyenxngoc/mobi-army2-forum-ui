import { useState, useEffect, useMemo } from 'react';
import { Button, Input, message, Select, Space, Table, Tag } from 'antd';

import { getClanMembersForOwner } from '~/services/clanService';
import { INITIAL_FILTERS, INITIAL_META } from '~/common/contans';
import { Link, useParams } from 'react-router-dom';
import useAuth from '~/hooks/useAuth';
import { checkIdIsNumber } from '~/utils/helper';
import queryString from 'query-string';
import Pagination from '~/components/Pagination';
import { kickClanMember, promoteClanMember } from '~/services/clanMemberService';

const options = [
    { value: 'username', label: 'Tên' },
    { value: 'id', label: 'ID' },
];

const getTagColor = (rights) => {
    switch (rights) {
        case 2:
            return <Tag color="red">Đội trưởng</Tag>;
        case 1:
            return <Tag color="green">Đội phó</Tag>;
        default:
            return <Tag color="default">Thành viên</Tag>;
    }
};

function ClanMembers() {
    const { clanId } = useParams();

    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const [searchInput, setSearchInput] = useState('');
    const [activeFilterOption, setActiveFilterOption] = useState(options[0].value);

    const [clanMembers, setClanMembers] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const { player } = useAuth();
    const [messageApi, contextHolder] = message.useMessage();

    const isClanIdValid = useMemo(() => checkIdIsNumber(clanId), [clanId]);
    const isPlayerClanLeader = useMemo(
        () =>
            player.clanMember && player.clanMember.rights > 0 && player.clanMember.clan.id === Number.parseInt(clanId),
        [clanId, player.clanMember],
    );

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

    const handleSortChange = (_, __, sorter) => {
        const sortOrder = sorter.order === 'ascend' ? true : sorter.order === 'descend' ? false : undefined;
        setFilters((prev) => ({
            ...prev,
            sortBy: sorter.field,
            isAscending: sortOrder,
        }));
    };

    const handleKick = async (memberId) => {
        try {
            const response = await kickClanMember(clanId, memberId);

            messageApi.success(response.data.data.message);

            // Tải lại danh sách thành viên
            setFilters((prev) => ({ ...prev, pageNum: 1 }));
        } catch (error) {
            messageApi.error(error.message);
        }
    };

    const handlePromote = async (memberId) => {
        try {
            const response = await promoteClanMember(clanId, memberId);

            messageApi.success(response.data.data.message);

            // Tải lại danh sách thành viên
            setFilters((prev) => ({ ...prev, pageNum: 1 }));
        } catch (error) {
            messageApi.error(error.message);
        }
    };

    useEffect(() => {
        const fetchClanMembers = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const params = queryString.stringify(filters);
                const response = await getClanMembersForOwner(clanId, params);
                const { meta, items } = response.data.data;
                setClanMembers(items);
                setMeta(meta);
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (isClanIdValid && isPlayerClanLeader) {
            fetchClanMembers();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clanId, filters]);

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
        },
        {
            title: 'Chức vụ',
            dataIndex: 'rights',
            key: 'rights',
            sorter: true,
            showSorterTooltip: false,
            render: (text) => getTagColor(text),
        },
        {
            title: 'Xu',
            dataIndex: 'xu',
            key: 'xu',
            sorter: true,
            showSorterTooltip: false,
        },
        {
            title: 'Lượng',
            dataIndex: 'luong',
            key: 'luong',
            sorter: true,
            showSorterTooltip: false,
        },
        {
            title: 'XP',
            dataIndex: 'xp',
            key: 'xp',
            sorter: true,
            showSorterTooltip: false,
        },
        {
            title: 'Điểm Clan',
            dataIndex: 'clanPoint',
            key: 'clanPoint',
            sorter: true,
            showSorterTooltip: false,
        },
        {
            title: 'Số lần đóng góp',
            dataIndex: 'contributeCount',
            key: 'contributeCount',
            sorter: true,
            showSorterTooltip: false,
        },
        {
            title: 'Thời gian đóng góp',
            dataIndex: 'contributeTime',
            key: 'contributeTime',
            render: (text) => (text ? new Date(text).toLocaleString() : '-'),
        },
        {
            title: 'Thời gian gia nhập',
            dataIndex: 'joinTime',
            key: 'joinTime',
            render: (text) => (text ? new Date(text).toLocaleString() : '-'),
        },
        {
            title: 'Thông tin đóng góp',
            dataIndex: 'contributeText',
            key: 'contributeText',
        },
        {
            title: 'Hành động',
            dataIndex: 'rights',
            key: 'rights',
            render: (rights, record) => (
                <Space>
                    {rights < 2 && (
                        <>
                            <Button type="primary" size="small" onClick={() => handleKick(record.id)} danger>
                                Đuổi
                            </Button>
                            <Button size="small" onClick={() => handlePromote(record.id)}>
                                Thăng chức
                            </Button>
                        </>
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
                <h4 className="forum-border-bottom text-primary">Quản lý thành viên</h4>

                <Space.Compact className="mb-2">
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

                <Table
                    dataSource={clanMembers}
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
                <Link to="/clan">Quay lại</Link>
            </div>

            {!isClanIdValid ? (
                <div className="alert alert-danger m-2 p-2" role="alert">
                    Lỗi: ID đội không hợp lệ. Vui lòng kiểm tra lại.
                </div>
            ) : !isPlayerClanLeader ? (
                <div className="alert alert-danger m-2 p-2" role="alert">
                    Lỗi: Bạn không có quyền để truy cập trang này
                </div>
            ) : (
                <>
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
            )}
        </div>
    );
}

export default ClanMembers;
