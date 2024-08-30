import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, message, InputNumber } from 'antd';
import { createGiftCode } from '~/services/giftCodeService';
import { handleError } from '~/utils/errorHandler';
import images from '~/assets';
import { useState } from 'react';
import EquipModal from './EquipModal';

const MAX_VALUE = 2000000000;

const defaultValue = {
    code: '',
    usageLimit: 0,
    expirationDate: '',
    xu: 0,
    luong: 0,
    exp: 0,
};

const validationSchema = yup.object({
    code: yup
        .string('Nhập mã quà tặng')
        .min(3, 'Mã quà tặng phải có ít nhất 3 ký tự')
        .max(20, 'Mã quà tặng chỉ được tối đa 20 ký tự')
        .required('Mã quà tặng là bắt buộc'),

    usageLimit: yup
        .number('Nhập giới hạn sử dụng')
        .min(0, 'Giới hạn sử dụng không được nhỏ hơn 0')
        .max(32000, 'Giới hạn sử dụng không được quá 32000')
        .required('Giới hạn sử dụng là bắt buộc'),

    xu: yup
        .number('Nhập số xu')
        .min(0, 'Số xu không được nhỏ hơn 0')
        .max(MAX_VALUE, `Số xu không được vượt quá ${MAX_VALUE}`)
        .required('Số xu là bắt buộc'),

    luong: yup
        .number('Nhập số lượng')
        .min(0, 'Số lượng không được nhỏ hơn 0')
        .max(MAX_VALUE, `Số lượng không được vượt quá ${MAX_VALUE}`)
        .required('Số lượng là bắt buộc'),

    exp: yup
        .number('Nhập kinh nghiệm')
        .min(0, 'Kinh nghiệm không được nhỏ hơn 0')
        .max(MAX_VALUE, `Kinh nghiệm không được vượt quá ${MAX_VALUE}`)
        .required('Kinh nghiệm là bắt buộc'),
});

function CreateGiftCode() {
    const [messageApi, contextHolder] = message.useMessage();

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        const completeData = {
            ...values,
            equips: equips,
        };
        try {
            const response = await createGiftCode(completeData);
            if (response.status === 200) {
                messageApi.success(response.data.data.message);
            }
            resetForm();
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

    /*
     */
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [equips, setEquips] = useState([]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleOk = (newEquip) => {
        setEquips([...equips, newEquip]);
        setIsModalVisible(false);
    };

    const renderInputNumber = (name, label, min, max) => (
        <div className="form-group mb-2">
            <label htmlFor={name}>{label}</label>
            <InputNumber
                size="large"
                id={name}
                name={name}
                min={min}
                max={max}
                value={formik.values[name]}
                onChange={(value) => formik.setFieldValue(name, value)}
                onBlur={formik.handleBlur}
                style={{ width: '100%' }}
                status={formik.touched[name] && formik.errors[name] ? 'error' : ''}
            />
            {formik.touched[name] && formik.errors[name] ? (
                <div className="text-danger">{formik.errors[name]}</div>
            ) : (
                <small className="form-text text-muted">
                    Giá trị trong khoảng từ {min} - {max}
                </small>
            )}
        </div>
    );

    return (
        <div className="box-container">
            {contextHolder}

            <EquipModal visible={isModalVisible} onCancel={handleCancel} onOk={handleOk} />

            <div className="header">
                <Link to="/admin/giftcode">Quay lại</Link>
            </div>

            <form className="p-2" onSubmit={formik.handleSubmit}>
                <h4 className="title">
                    Tạo mới mã quà tặng <img src={images.newGif} alt="new" />
                </h4>

                <div className="form-group mb-2">
                    <label htmlFor="code">Mã quà tặng</label>
                    <input
                        type="text"
                        className={`form-control ${formik.touched.code && formik.errors.code ? 'is-invalid' : ''}`}
                        id="code"
                        name="code"
                        aria-describedby="codeHelp"
                        placeholder="Nhập mã quà tặng"
                        value={formik.values.code}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.code && formik.errors.code ? (
                        <div className="text-danger">{formik.errors.code}</div>
                    ) : (
                        <small id="codeHelp" className="form-text text-muted">
                            Độ dài từ 3 - 20 kí tự
                        </small>
                    )}
                </div>

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

                {renderInputNumber('usageLimit', 'Giới hạn sử dụng', 0, 32000)}

                {renderInputNumber('xu', 'Số xu', 0, MAX_VALUE)}

                {renderInputNumber('luong', 'Số lượng', 0, MAX_VALUE)}

                {renderInputNumber('exp', 'Kinh nghiệm', 0, MAX_VALUE)}

                <Button type="primary" onClick={showModal}>
                    Thêm Equip
                </Button>

                {equips.map((equip, index) => (
                    <div key={index}>
                        <p>Equip {index + 1}</p>
                        <p>K: {equip.k}</p>
                        <p>EI: {equip.ei}</p>
                        <p>ET: {equip.et}</p>
                        <p>VL: {equip.vl}</p>
                        <p>PD: {equip.pd}</p>
                        <p>CID: {equip.cid}</p>
                        <p>IU: {equip.iu}</p>
                    </div>
                ))}

                <div className="text-center">
                    <Button type="primary" htmlType="submit" loading={formik.isSubmitting}>
                        Tạo mới
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default CreateGiftCode;
