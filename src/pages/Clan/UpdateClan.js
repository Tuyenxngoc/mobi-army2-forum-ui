import { useState, useEffect, useMemo } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, message } from 'antd';

import { getClanById, getclanIcons, updateClan } from '~/services/clanService';
import { RESOURCE_URL } from '~/common/commonConstants';
import { Link, useParams } from 'react-router-dom';
import { handleError } from '~/utils/errorHandler';
import useAuth from '~/hooks/useAuth';
import { checkIdIsNumber } from '~/utils/helper';

import Style from './ClanForm.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(Style);

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

    const [icons, setIcons] = useState([]);

    const { player } = useAuth();
    const [messageApi, contextHolder] = message.useMessage();

    const isClanIdValid = useMemo(() => checkIdIsNumber(clanId), [clanId]);
    const isPlayerClanOwner = useMemo(
        () =>
            player.clanMember &&
            player.clanMember.rights === 2 &&
            player.clanMember.clan.id === Number.parseInt(clanId),
        [clanId, player.clanMember],
    );

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
        const fetchIcons = async () => {
            try {
                const response = await getclanIcons();
                setIcons(response.data.data);
            } catch (error) {
                messageApi.error('Lỗi khi tải icons: ' + error.message);
            }
        };

        if (isClanIdValid && isPlayerClanOwner) {
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

        if (isClanIdValid && isPlayerClanOwner) {
            fetchClan();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clanId]);

    return (
        <div className="box-container">
            {contextHolder}

            <div className="header">
                <Link to="/clan">Quay lại</Link>
            </div>

            {!isClanIdValid ? (
                <div className="alert alert-danger m-2 p-2" role="alert">
                    Lỗi: ID đội không hợp lệ. Vui lòng kiểm tra lại.
                </div>
            ) : !isPlayerClanOwner ? (
                <div className="alert alert-danger m-2 p-2" role="alert">
                    Lỗi: Bạn không có quyền để truy cập trang này
                </div>
            ) : (
                <form className="p-2" onSubmit={formik.handleSubmit}>
                    <h4 className="title">Cập nhật thông tin đội</h4>

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

                    <div className="form-group mb-2">
                        <span>Hãy lựa chọn ảnh đại diện cho đội:</span>
                        <div className={cx('icon-grid-container')}>
                            {icons.map((icon) => (
                                <div
                                    key={icon.id}
                                    className={cx('icon-item', { selected: formik.values.icon === icon.id })}
                                    onClick={() => formik.setFieldValue('icon', icon.id)}
                                >
                                    <img
                                        src={RESOURCE_URL + icon.src}
                                        alt={`Icon ${icon.id}`}
                                        className={cx('icon-image')}
                                    />
                                </div>
                            ))}
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
