import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, InputNumber, message, Spin } from 'antd';
import { handleError } from '~/utils/errorHandler';
import { checkIdIsNumber } from '~/utils/helper';
import { getGiftCodeById, updateGiftCode } from '~/services/giftCodeService';
import NumberToString from '~/components/NumberFormatter/NumberToString';
import { BASE_URL } from '~/common/commonConstants';
import NumberFormatter from '~/components/NumberFormatter/NumberFormatter';

const defaultValue = {
    usageLimit: 0,
    expirationDate: '',
};

const validationSchema = yup.object({
    usageLimit: yup
        .number('Nhập giới hạn sử dụng')
        .min(0, 'Giới hạn sử dụng không được nhỏ hơn 0')
        .max(32000, 'Giới hạn sử dụng không được quá 32000')
        .required('Giới hạn sử dụng là bắt buộc'),
});

function UpdateGiftCode() {
    const navigate = useNavigate();
    const { giftCodeId } = useParams();
    const [giftCode, setGiftCode] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const [messageApi, contextHolder] = message.useMessage();

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await updateGiftCode(giftCodeId, values);
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
        if (!checkIdIsNumber(giftCodeId)) {
            navigate('/admin/giftcode', { replace: true });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const fetchGiftCode = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                if (!checkIdIsNumber(giftCodeId)) return;

                const response = await getGiftCodeById(giftCodeId);
                const data = response.data.data;

                setGiftCode(data);
                formik.setValues({
                    usageLimit: data.usageLimit,
                    expirationDate: data.expirationDate,
                });
            } catch (error) {
                setErrorMessage(error.response?.data?.message || error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGiftCode();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="alert alert-primary m-2 p-2" role="alert">
                    Loading... <Spin />
                </div>
            );
        }

        if (errorMessage) {
            return (
                <div className="alert alert-danger m-2 p-2" role="alert">
                    Lỗi: {errorMessage}
                </div>
            );
        }

        return (
            <div className="p-2">
                <h4 className="title">Thông tin mã quà tặng</h4>

                <ul className="mb-2 ps-3" style={{ listStyle: 'disc' }}>
                    <li>Ngày tạo: {giftCode.createdDate}</li>
                    <li>Sửa đổi lần cuối: {giftCode.lastModifiedDate}</li>
                    <li>Tạo bởi: {giftCode.createdBy}</li>
                    <li>Sửa bởi: {giftCode.lastModifiedBy}</li>
                    <li>ID: {giftCode.id}</li>
                    <li>Code: {giftCode.code}</li>
                    <li>
                        Xu:&nbsp;
                        <NumberFormatter number={giftCode.xu} />
                    </li>
                    <li>
                        Lượng:&nbsp;
                        <NumberFormatter number={giftCode.luong} />
                    </li>
                    <li>
                        Kinh nghiệm:&nbsp;
                        <NumberFormatter number={giftCode.exp} />
                    </li>
                    <li>Số lượt đã dùng: {giftCode.usageCount}</li>
                    <li>
                        Danh sách người chơi sử dụng: <Link to="./player">Xem</Link>
                    </li>
                </ul>

                <h5 className="title">Vật phẩm</h5>
                <table className="table table-hover align-middle">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Vật phẩm</th>
                            <th scope="col">Chi tiết</th>
                            <th scope="col">Số lượng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {giftCode.items.length > 0 ? (
                            giftCode.items.map((item, index) => (
                                <tr key={index}>
                                    <th scope="row">{item.id}</th>
                                    <td>
                                        <img src={BASE_URL + item.imageUrl} className="pixel-art" alt="item" />
                                        <span>&nbsp;{item.name}</span>
                                    </td>
                                    <td>{item.detail}</td>
                                    <td>{item.quantity}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" align="center">
                                    Chưa có vật phẩm nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <h5 className="title">Trang Bị</h5>
                <table className="table table-hover align-middle">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Tên</th>
                            <th scope="col">Chỉ số</th>
                        </tr>
                    </thead>
                    <tbody>
                        {giftCode.equips.length > 0 ? (
                            giftCode.equips.map((equip, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <img src={BASE_URL + equip.imageUrl} className="pixel-art" alt="equip" />
                                        <span>&nbsp;{equip.name}</span>
                                    </td>
                                    <td>
                                        {JSON.stringify(equip.points)}
                                        <br />
                                        {JSON.stringify(equip.percents)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" align="center">
                                    Chưa có trang bị nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <form onSubmit={formik.handleSubmit}>
                    <h4 className="title">Cập nhật mã quà tặng</h4>

                    <div className="form-group mb-2">
                        <label htmlFor="expirationDate">Ngày hết hạn</label>
                        <input
                            type="datetime-local"
                            className={`form-control ${
                                formik.touched.expirationDate && formik.errors.expirationDate ? 'is-invalid' : ''
                            }`}
                            id="expirationDate"
                            name="expirationDate"
                            aria-describedby="expirationDateHelp"
                            value={formik.values.expirationDate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.expirationDate && formik.errors.expirationDate ? (
                            <div className="text-danger">{formik.errors.expirationDate}</div>
                        ) : (
                            <small id="expirationDateHelp" className="form-text text-muted">
                                Để trống nếu mã không có hạn sử dụng
                            </small>
                        )}
                    </div>

                    <div className="form-group mb-2">
                        <label htmlFor="usageLimit">Giới hạn sử dụng</label>
                        <InputNumber
                            size="large"
                            id="usageLimit"
                            min={0}
                            max={32000}
                            defaultValue={0}
                            value={formik.values.usageLimit}
                            onChange={(value) => formik.setFieldValue('usageLimit', value)}
                            onBlur={formik.handleBlur}
                            status={formik.touched.usageLimit && formik.errors.usageLimit ? 'error' : ''}
                            style={{ width: '100%' }}
                        />
                        {formik.touched.usageLimit && formik.errors.usageLimit ? (
                            <div className="text-danger">{formik.errors.usageLimit}</div>
                        ) : formik.values.usageLimit > 0 ? (
                            <small className="form-text text-muted">
                                {<NumberToString number={formik.values.usageLimit} />}
                            </small>
                        ) : (
                            <small className="form-text text-muted">Giá trị trong khoảng từ 0 - 32000</small>
                        )}
                    </div>

                    <div className="text-center">
                        <Button type="primary" htmlType="submit" loading={formik.isSubmitting}>
                            Lưu
                        </Button>
                    </div>
                </form>
            </div>
        );
    };

    return (
        <div className="box-container">
            {contextHolder}

            <div className="header">
                <Link to="/admin/giftcode">Quay lại</Link>
            </div>

            {renderContent()}
        </div>
    );
}

export default UpdateGiftCode;
