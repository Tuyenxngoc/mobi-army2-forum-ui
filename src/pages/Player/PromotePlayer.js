import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Button, message } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { handleError } from '~/utils/errorHandler';
import { getRoles } from '~/services/roleService';
import { updateRole } from '~/services/userService';
import { checkIdIsNumber } from '~/utils/helper';
import { ROLES_NAME } from '~/common/contans';

const defaultValue = {
    roleId: 0,
};

const validationSchema = yup.object({
    roleId: yup.number().required('Vui lòng chọn quyền người dùng'),
});

export const ROLES_DESCRIPTION = {
    ROLE_SUPER_ADMIN: 'Quyền quản trị viên cấp cao, có toàn quyền quản lý hệ thống.',
    ROLE_ADMIN: 'Quyền quản trị viên, có quyền quản lý người dùng và nội dung.',
    ROLE_MODERATOR: 'Quyền điều hành viên, có thể giám sát và kiểm duyệt nội dung.',
    ROLE_SUPPORT: 'Quyền hỗ trợ viên, có thể giúp đỡ và hỗ trợ người dùng.',
    ROLE_USER: 'Quyền người dùng, chỉ có thể xem và tương tác với nội dung.',
};

function PromotePlayer() {
    const { playerId } = useParams();
    const navigate = useNavigate();

    const [roles, setRoles] = useState([]);
    const [roleDescription, setRoleDescription] = useState('');

    const [messageApi, contextHolder] = message.useMessage();

    const handleRoleChange = (event) => {
        const selectedRoleId = event.target.value;
        formik.handleChange(event);

        const selectedRole = roles.find((role) => role.id === parseInt(selectedRoleId));
        if (selectedRole) {
            setRoleDescription(ROLES_DESCRIPTION[selectedRole.name] || '');
        }
    };

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                if (!checkIdIsNumber(playerId)) {
                    return;
                }
                const response = await getRoles();
                if (response.status === 200) {
                    const { data } = response.data;

                    setRoles(data);
                    formik.setFieldValue('roleId', data[0].id);
                    setRoleDescription(ROLES_DESCRIPTION[data[0].name] || '');
                }
            } catch (error) {
                messageApi.error('Lỗi khi lấy danh sách quyền người dùng');
            }
        };

        fetchRoles();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await updateRole(playerId, values.roleId);
            if (response.status === 200) {
                messageApi.success(response.data.data.message);
            }
        } catch (error) {
            handleError(error, formik, messageApi);
        } finally {
            setSubmitting(false);
        }
    };

    const formik = useFormik({
        initialValues: defaultValue,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    useEffect(() => {
        if (!checkIdIsNumber(playerId)) {
            navigate('/admin/player', { replace: true });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playerId]);

    return (
        <div className="box-container">
            {contextHolder}
            <div className="header">
                <Link to="/admin/player">Quay lại</Link>
            </div>

            <div className="p-2">
                <h4 className="title">Phân quyền tài khoản</h4>

                <form onSubmit={formik.handleSubmit}>
                    <div className="form-group mb-2">
                        <label htmlFor="roleId">Chọn quyền</label>
                        <select
                            id="roleId"
                            name="roleId"
                            className={`form-control ${
                                formik.touched.roleId && formik.errors.roleId ? 'is-invalid' : ''
                            }`}
                            value={formik.values.roleId}
                            onChange={handleRoleChange}
                            onBlur={formik.handleBlur}
                        >
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {ROLES_NAME[role.name] || role.name}
                                </option>
                            ))}
                        </select>
                        {formik.touched.roleId && formik.errors.roleId ? (
                            <div className="text-danger">{formik.errors.roleId}</div>
                        ) : (
                            <small className="form-text text-muted">
                                Chỉ có thể cấp quyền thấp hơn quyền hiện tại của bạn
                            </small>
                        )}
                    </div>

                    {roleDescription && (
                        <div className="alert alert-light p-2" role="alert">
                            Mô tả quyền: {roleDescription}
                        </div>
                    )}

                    <div className="text-center">
                        <Button type="primary" htmlType="submit" loading={formik.isSubmitting}>
                            Cấp quyền
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PromotePlayer;
