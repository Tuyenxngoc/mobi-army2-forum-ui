import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Button, message } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { handleError } from '~/utils/errorHandler';
import { getRoles } from '~/services/roleService';
import { updateRole } from '~/services/userService';
import { checkIdIsNumber } from '~/utils/helper';

const defaultValue = {
    roleId: 0,
};

const validationSchema = yup.object({
    roleId: yup.number().required('Vui lòng chọn quyền người dùng'),
});

function PromotePlayer() {
    const { playerId } = useParams();
    const navigate = useNavigate();

    const [roles, setRoles] = useState([]);

    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                if (!checkIdIsNumber(playerId)) {
                    return;
                }
                const response = await getRoles();
                if (response.status === 200) {
                    setRoles(response.data.data);
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
                <h4 className="title">Nâng quyền tài khoản</h4>

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
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        >
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
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
