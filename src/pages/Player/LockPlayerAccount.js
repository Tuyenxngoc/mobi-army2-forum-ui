import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, message } from 'antd';
import { useFormik } from 'formik';
import { lockPlayerAccount } from '~/services/userService';
import { handleError } from '~/utils/errorHandler';
import { useEffect, useState } from 'react';
import { checkIdIsNumber } from '~/utils/helper';

const lockReasons = [
    { value: 'fraud', label: 'Gian lận' },
    { value: 'spam', label: 'Spam' },
    { value: 'terms_violation', label: 'Vi phạm điều khoản' },
    { value: 'inactive', label: 'Không hoạt động' },
    { value: 'other', label: 'Lý do khác' },
];

const defaultValue = {
    lockTime: '',
    lockReason: '',
};

const calculateDaysLocked = (lockTime) => {
    const currentDate = new Date();
    const selectedDate = new Date(lockTime);
    const timeDifference = selectedDate.getTime() - currentDate.getTime();
    return Math.ceil(timeDifference / (1000 * 3600 * 24));
};

function LockPlayerAccount() {
    const { playerId } = useParams();
    const navigate = useNavigate();

    const [daysLocked, setDaysLocked] = useState(null);

    const [messageApi, contextHolder] = message.useMessage();

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await lockPlayerAccount(playerId, values);
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
        onSubmit: handleSubmit,
    });

    useEffect(() => {
        if (!checkIdIsNumber(playerId)) {
            navigate('/admin/player', { replace: true });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playerId]);

    useEffect(() => {
        if (formik.values.lockTime) {
            const days = calculateDaysLocked(formik.values.lockTime);
            setDaysLocked(days);
        } else {
            setDaysLocked(null);
        }
    }, [formik.values.lockTime]);

    return (
        <div className="box-container">
            {contextHolder}

            <div className="header">
                <Link to="/admin/player">Quay lại</Link>
            </div>

            <div className="p-2">
                <h4 className="title">Khóa tài khoản</h4>

                <form onSubmit={formik.handleSubmit}>
                    <div className="form-group mb-2">
                        <label htmlFor="lockTime">Thời gian khóa</label>
                        <input
                            type="date"
                            className={`form-control ${
                                formik.touched.lockTime && formik.errors.lockTime ? 'is-invalid' : ''
                            }`}
                            id="lockTime"
                            aria-describedby="lockTimeHelp"
                            placeholder="Chọn thời gian khóa"
                            value={formik.values.lockTime}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <small id="lockTimeHelp" className="form-text text-muted">
                            Chọn thời gian khóa. Để trống nếu muốn khóa vĩnh viễn. Chọn thời gian trong quá khứ để mở
                            khóa.
                        </small>
                    </div>

                    <div className="form-group mb-2">
                        <label htmlFor="lockReason">Lý do khóa</label>
                        <select
                            className="form-control"
                            id="lockReason"
                            name="lockReason"
                            aria-describedby="lockReasonHelp"
                            value={formik.values.lockReason || ''}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        >
                            <option value="">Chọn lý do</option>
                            {lockReasons.map((reason) => (
                                <option key={reason.value} value={reason.value}>
                                    {reason.label}
                                </option>
                            ))}
                        </select>
                        <small id="lockReasonHelp" className="form-text text-muted">
                            Có thể trống
                        </small>
                    </div>

                    <div className="text-center">
                        {daysLocked === null ? (
                            <Button danger type="primary" htmlType="submit" loading={formik.isSubmitting}>
                                Khóa vĩnh viễn
                            </Button>
                        ) : daysLocked < 0 ? (
                            <Button type="primary" htmlType="submit" loading={formik.isSubmitting}>
                                Mở khóa
                            </Button>
                        ) : (
                            <Button danger type="primary" htmlType="submit" loading={formik.isSubmitting}>
                                {`Khóa trong ${daysLocked} ngày`}
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LockPlayerAccount;
