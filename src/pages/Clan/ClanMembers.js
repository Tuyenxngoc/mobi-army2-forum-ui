import { useState, useEffect, useMemo } from 'react';
import { message, Table } from 'antd';

import { getClanMembersForOwner } from '~/services/clanService';
import { INITIAL_FILTERS, INITIAL_META } from '~/common/contans';
import { Link, useParams } from 'react-router-dom';
import useAuth from '~/hooks/useAuth';
import { checkIdIsNumber } from '~/utils/helper';
import queryString from 'query-string';
import Pagination from '~/components/Pagination';

function ClanMembers() {
    const { clanId } = useParams();

    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

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
        },
        {
            title: 'Quyền',
            dataIndex: 'rights',
            key: 'rights',
        },
        {
            title: 'Xu',
            dataIndex: 'xu',
            key: 'xu',
        },
        {
            title: 'Lương',
            dataIndex: 'luong',
            key: 'luong',
        },
        {
            title: 'XP',
            dataIndex: 'xp',
            key: 'xp',
        },
        {
            title: 'Điểm Clan',
            dataIndex: 'clanPoint',
            key: 'clanPoint',
        },
        {
            title: 'Số lần đóng góp',
            dataIndex: 'contributeCount',
            key: 'contributeCount',
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
                    dataSource={clanMembers}
                    columns={columns}
                    size="small"
                    pagination={false}
                    rowKey="id"
                    loading={isLoading}
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
