import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, message } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { lockPlayerAccount } from '~/services/authService'; // Assuming you have this function
import { handleError } from '~/utils/errorHandler';
import { useEffect, useState } from 'react';
import { checkIdIsNumber } from '~/utils/helper';

const defaultValue = {
    lockTime: '',
};

const validationSchema = yup.object({
    lockTime: yup
        .date()
        .required('Vui lòng chọn thời gian khóa tài khoản')
        .min(new Date(), 'Thời gian khóa phải là thời gian trong tương lai'),
});

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
        validationSchema: validationSchema,
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
            setDaysLocked(days > 0 ? days : null);
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
                        {formik.touched.lockTime && formik.errors.lockTime ? (
                            <div className="text-danger">{formik.errors.lockTime}</div>
                        ) : (
                            <small id="lockTimeHelp" className="form-text text-muted">
                                Chọn thời gian khóa
                            </small>
                        )}
                    </div>

                    <div className="text-center">
                        <Button danger type="primary" htmlType="submit" loading={formik.isSubmitting}>
                            {daysLocked !== null ? `Khóa trong ${daysLocked} ngày` : 'Khóa'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LockPlayerAccount;
