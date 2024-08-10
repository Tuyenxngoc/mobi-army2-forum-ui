import { useState, useMemo, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import queryString from 'query-string';
import { Button, message, Space } from 'antd';

import { checkIdIsNumber } from '~/utils/helper';
import useAuth from '~/hooks/useAuth';
import { INITIAL_FILTERS, INITIAL_META } from '~/common/contans';
import Pagination from '~/components/Pagination';
import { approveMember, getApprovals, rejectMember } from '~/services/clanApprovalService';

function ApproveClanMembers() {
    const { clanId } = useParams();

    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const [pendingApprovals, setPendingApprovals] = useState([]);

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

    const handleApprove = async (approvalId) => {
        try {
            const response = await approveMember(clanId, approvalId);
            messageApi.success(response.data.data.message);

            setFilters((prev) => ({ ...prev, pageNum: 1 }));
        } catch (error) {
            messageApi.error(`Lỗi khi chấp nhận thành viên: ${error.message}`);
        }
    };

    const handleReject = async (approvalId) => {
        try {
            const response = await rejectMember(clanId, approvalId);
            messageApi.success(response.data.data.message);

            setFilters((prev) => ({ ...prev, pageNum: 1 }));
        } catch (error) {
            messageApi.error(`Lỗi khi từ chối thành viên: ${error.message}`);
        }
    };

    useEffect(() => {
        const fetchClanMembers = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const params = queryString.stringify(filters);
                const response = await getApprovals(clanId, params);
                const { meta, items } = response.data.data;
                setPendingApprovals(items);
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
                <h4 className="forum-border-bottom text-primary">Duyệt thành viên</h4>

                <table className="table align-middle mb-0">
                    <thead>
                        <tr>
                            <th scope="col">Tên</th>
                            <th scope="col">Thời gian</th>
                            <th scope="col">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingApprovals.length > 0 ? (
                            pendingApprovals.map((item, index) => (
                                <tr key={index}>
                                    <th scope="row">{item.username}</th>
                                    <td>{item.createdDate}</td>
                                    <td>
                                        <Space>
                                            <Button type="primary" size="small" onClick={() => handleApprove(item.id)}>
                                                Chấp nhận
                                            </Button>
                                            <Button size="small" onClick={() => handleReject(item.id)}>
                                                Từ chối
                                            </Button>
                                        </Space>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" align="center">
                                    Biệt đội chưa có đơn xin gia nhập nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
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

export default ApproveClanMembers;
