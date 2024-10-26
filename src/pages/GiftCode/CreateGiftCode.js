import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, message, InputNumber, Descriptions, Modal } from 'antd';
import { createGiftCode } from '~/services/giftCodeService';
import { handleError } from '~/utils/errorHandler';
import images from '~/assets';
import EquipModal from './EquipModal';
import NumberToString from '~/components/NumberFormatter/NumberToString';
import SpecialItemModal from './SpecialItemModal';

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
    const [isEquipModalVisible, setIsEquipModalVisible] = useState(false);
    const [isItemModalVisible, setIsItemModalVisible] = useState(false);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

    const [equips, setEquips] = useState([]);
    const [items, setItems] = useState([]);

    const [editingEquipIndex, setEditingEquipIndex] = useState(null);
    const [editingItemIndex, setEditingItemIndex] = useState(null);

    const [messageApi, contextHolder] = message.useMessage();

    const handleConfirm = async () => {
        const values = formik.values;
        const completeData = {
            ...values,
            equips: equips,
            items: items,
        };
        formik.setSubmitting(true);
        try {
            const response = await createGiftCode(completeData);
            if (response.status === 201) {
                messageApi.success(response.data.data.message);
                formik.resetForm();
                setEquips([]);
                setItems([]);
                setIsConfirmModalVisible(false);
            }
        } catch (error) {
            handleError(error, formik, messageApi);
        } finally {
            formik.setSubmitting(false);
        }
    };

    const formik = useFormik({
        initialValues: defaultValue,
        validationSchema: validationSchema,
        onSubmit: (_, { setSubmitting }) => {
            setSubmitting(false);
            setIsConfirmModalVisible(true);
        },
    });

    const showEquipModal = () => {
        setEditingEquipIndex(null);
        setIsEquipModalVisible(true);
    };

    const showItemModal = () => {
        setEditingItemIndex(null);
        setIsItemModalVisible(true);
    };

    const handleEquipCancel = () => {
        setIsEquipModalVisible(false);
    };

    const handleItemCancel = () => {
        setIsItemModalVisible(false);
    };

    const handleEquipOk = (newEquip) => {
        if (editingEquipIndex !== null) {
            const updatedEquips = [...equips];
            updatedEquips[editingEquipIndex] = newEquip;
            setEquips(updatedEquips);
            setEditingEquipIndex(null);
        } else {
            setEquips([...equips, newEquip]);
        }
        setIsEquipModalVisible(false);
    };

    const handleItemOk = (newItem) => {
        if (editingItemIndex !== null) {
            const updatedItems = [...items];
            updatedItems[editingItemIndex] = newItem;
            setItems(updatedItems);
            setEditingItemIndex(null);
        } else {
            setItems([...items, newItem]);
        }
        setIsItemModalVisible(false);
    };

    const handleEditEquip = (index) => {
        setEditingEquipIndex(index);
        setIsEquipModalVisible(true);
    };

    const handleDeleteEquip = (index) => {
        const newEquips = equips.filter((_, i) => i !== index);
        setEquips(newEquips);
    };

    const handleEditItem = (index) => {
        setEditingItemIndex(index);
        setIsItemModalVisible(true);
    };

    const handleDeleteItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const renderInputNumber = (name, label, min, max) => (
        <div className="form-group mb-2">
            <label htmlFor={name}>{label}</label>
            <InputNumber
                size="large"
                id={name}
                min={min}
                max={max}
                defaultValue={0}
                value={formik.values[name]}
                onChange={(value) => formik.setFieldValue(name, value)}
                onBlur={formik.handleBlur}
                status={formik.touched[name] && formik.errors[name] ? 'error' : ''}
                style={{ width: '100%' }}
            />
            {formik.touched[name] && formik.errors[name] ? (
                <div className="text-danger">{formik.errors[name]}</div>
            ) : formik.values[name] > 0 ? (
                <small className="form-text text-muted">{<NumberToString number={formik.values[name]} />}</small>
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

            <EquipModal
                visible={isEquipModalVisible}
                handleCancel={handleEquipCancel}
                onOk={handleEquipOk}
                initialValues={equips[editingEquipIndex]}
            />

            <SpecialItemModal
                visible={isItemModalVisible}
                handleCancel={handleItemCancel}
                onOk={handleItemOk}
                initialValues={items[editingItemIndex]}
            />

            <Modal
                title="Xác nhận phần thưởng"
                open={isConfirmModalVisible}
                onOk={handleConfirm}
                onCancel={() => setIsConfirmModalVisible(false)}
                confirmLoading={formik.isSubmitting}
                okText="Xác nhận"
                cancelText="Hủy"
            >
                <Descriptions bordered column={{ xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 2 }} size="small">
                    <Descriptions.Item label="Mã quà tặng">{formik.values.code}</Descriptions.Item>
                    <Descriptions.Item label="Giới hạn sử dụng">{formik.values.usageLimit}</Descriptions.Item>
                    <Descriptions.Item label="Ngày hết hạn">
                        {formik.values.expirationDate || 'Không có'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Xu">{formik.values.xu}</Descriptions.Item>
                    <Descriptions.Item label="Lượng">{formik.values.luong}</Descriptions.Item>
                    <Descriptions.Item label="Kinh nghiệm">{formik.values.exp}</Descriptions.Item>
                    <Descriptions.Item label="Số lượng trang bị">{equips.length}</Descriptions.Item>
                    <Descriptions.Item label="Số lượng item">{items.length}</Descriptions.Item>
                </Descriptions>
            </Modal>

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

                <Button type="primary" size="small" onClick={showEquipModal}>
                    Thêm trang bị
                </Button>
                <div className="form-text">Tối đa 10 trang bị</div>

                <h6 className="title mt-2">Danh Sách Trang Bị</h6>
                <table className="table table-hover align-middle">
                    <thead>
                        <tr>
                            <th scope="col">Index</th>
                            <th scope="col">Nhân vật</th>
                            <th scope="col">Loại</th>
                            <th scope="col">Chỉ số</th>
                            <th scope="col">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equips.length > 0 ? (
                            equips.map((equip, index) => (
                                <tr key={index}>
                                    <th scope="row">{equip.ei}</th>
                                    <td>{equip.cid}</td>
                                    <td>{equip.et}</td>
                                    <td>
                                        {JSON.stringify(equip.ap)}
                                        <br />
                                        {JSON.stringify(equip.apc)}
                                    </td>
                                    <td>
                                        <Button type="link" size="small" onClick={() => handleEditEquip(index)}>
                                            Sửa
                                        </Button>
                                        <Button
                                            danger
                                            type="link"
                                            size="small"
                                            onClick={() => handleDeleteEquip(index)}
                                        >
                                            Xóa
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" align="center">
                                    Chưa thêm trang bị nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <Button type="primary" size="small" onClick={showItemModal}>
                    Thêm item
                </Button>
                <div className="form-text">Tối đa 10 item</div>

                <h6 className="title mt-2">Danh Sách Item</h6>
                <table className="table table-hover align-middle">
                    <thead>
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Số lượng</th>
                            <th scope="col">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length > 0 ? (
                            items.map((item, index) => (
                                <tr key={index}>
                                    <th scope="row">{item.i}</th>
                                    <td>{item.q}</td>
                                    <td>
                                        <Button type="link" size="small" onClick={() => handleEditItem(index)}>
                                            Sửa
                                        </Button>
                                        <Button danger type="link" size="small" onClick={() => handleDeleteItem(index)}>
                                            Xóa
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" align="center">
                                    Chưa thêm item nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="alert alert-warning" role="alert">
                    Mã quà tặng sau khi tạo sẽ không thể cập nhật lại phần thưởng
                </div>

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
