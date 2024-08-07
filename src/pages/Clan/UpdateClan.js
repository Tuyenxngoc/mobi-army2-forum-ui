import { useState, useEffect, useMemo } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, message } from 'antd';

import { getClanById, getclanIcons, updateClan } from '~/services/clanService';
import { BASE_URL } from '~/common/contans';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { handleError } from '~/utils/errorHandler';
import useAuth from '~/hooks/useAuth';
import { checkIdIsNumber } from '~/utils/helper';

const defaultValue = {
    description: '',
    notification: '',
    requireApproval: true,
    icon: 0,
};

const validationSchema = yup.object({
    description: yup.string().required('Vui lòng thêm mô tả'),

    icon: yup.number().required('Bạn phải chọn một ảnh đại diện'),
});

function UpdateClan() {
    const { clanId } = useParams();
    const navigate = useNavigate();
    const [icons, setIcons] = useState([]);
    const { player } = useAuth();
    const [messageApi, contextHolder] = message.useMessage();

    const isClanIdInvalid = useMemo(() => checkIdIsNumber(clanId), [clanId]);

    const rows = useMemo(() => {
        const organizedRows = [];
        for (let i = 0; i < icons.length; i += 10) {
            organizedRows.push(icons.slice(i, i + 10));
        }
        return organizedRows;
    }, [icons]);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await updateClan(clanId, values);
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
        if (
            !player.clanMember ||
            player.clanMember.rights !== 2 ||
            player.clanMember.clan.id !== Number.parseInt(clanId)
        ) {
            navigate('/', { replace: true });
        }
    }, [clanId, navigate, player.clanMember]);

    useEffect(() => {
        const fetchIcons = async () => {
            try {
                const response = await getclanIcons();
                setIcons(response.data.data);
            } catch (error) {
                messageApi.error('Lỗi khi tải icons: ' + error.message);
            }
        };

        if (!isClanIdInvalid) {
            fetchIcons();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const fetchClan = async () => {
            try {
                const response = await getClanById(clanId);
                const clan = response.data.data;
                formik.setValues({
                    description: clan.description || '',
                    notification: clan.notification || '',
                    requireApproval: clan.requireApproval,
                    icon: clan.iconId,
                });
            } catch (error) {
                messageApi.error(`Lỗi khi tải thông tin : ${error.message}`);
            }
        };

        if (!isClanIdInvalid) {
            fetchClan();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clanId]);

    return (
        <div className="box-container">
            {contextHolder}

            <div className="forum-header">
                <Link to="/clan">Quay lại</Link>
            </div>

            {isClanIdInvalid ? (
                <div className="alert alert-danger m-2 p-2" role="alert">
                    Lỗi: ID đội không hợp lệ. Vui lòng kiểm tra lại.
                </div>
            ) : (
                <form className="p-2" onSubmit={formik.handleSubmit}>
                    <h3 className="forum-border-bottom text-primary mb-4">Cập nhật thông tin đội</h3>

                    <div className="form-group mb-2">
                        <label htmlFor="description">Mô tả</label>
                        <textarea
                            rows={2}
                            type="text"
                            className={`form-control ${
                                formik.touched.description && formik.errors.description ? 'is-invalid' : ''
                            }`}
                            id="description"
                            aria-describedby="descriptionHelp"
                            placeholder="Nhập mô tả"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />

                        {formik.touched.description && formik.errors.description ? (
                            <div className="text-danger">{formik.errors.description}</div>
                        ) : (
                            <small id="descriptionHelp" className="form-text text-muted">
                                Mô tải biệt đội tối đa 255 kí tự
                            </small>
                        )}
                    </div>

                    <div className="form-group mb-2">
                        <label htmlFor="notification">Thông báo</label>
                        <textarea
                            rows={2}
                            type="text"
                            className="form-control"
                            id="notification"
                            aria-describedby="notificationHelp"
                            placeholder="Nhập thông báo"
                            value={formik.values.notification}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <small id="notificationHelp" className="form-text text-muted">
                            Thông báo tối đa 255 kí tự
                        </small>
                    </div>

                    <div className="form-group mb-2">
                        <div className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="requireApproval"
                                name="requireApproval"
                                checked={formik.values.requireApproval}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <label className="form-check-label" htmlFor="requireApproval">
                                Yêu cầu phê duyệt cho thành viên mới
                            </label>
                        </div>
                    </div>

                    <div className="form-group mb-2 ">
                        <span>Hãy lựa chọn ảnh đại diện cho đội:</span>
                        <div className="table-responsive">
                            <table className="table table-bordered align-middle bg-white">
                                <tbody>
                                    {rows.map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {row.map((icon) => (
                                                <td key={icon.id}>
                                                    <label className="form-check-label me-2" htmlFor={`icon${icon.id}`}>
                                                        <img src={BASE_URL + icon.src} alt={`Icon ${icon.id}`} />
                                                    </label>
                                                    <input
                                                        type="radio"
                                                        name="icon"
                                                        id={`icon${icon.id}`}
                                                        value={icon.id}
                                                        // eslint-disable-next-line eqeqeq
                                                        checked={formik.values.icon == icon.id}
                                                        onChange={formik.handleChange}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="text-center">
                        <Button type="primary" htmlType="submit" loading={formik.isSubmitting}>
                            Cập nhật
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default UpdateClan;
