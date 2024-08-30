import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, Flex, InputNumber, Modal, Select } from 'antd';
import { getEquipsByCharacterIdAndType } from '~/services/equipService';

const equipTypeOptions = [
    { value: 0, label: 'Súng' },
    { value: 1, label: 'Nón, tóc' },
    { value: 2, label: 'Giáp' },
    { value: 3, label: 'Kính' },
    { value: 4, label: 'Balo, cánh' },
];

const characterOptions = [
    { value: 0, label: 'Gunner' },
    { value: 1, label: 'Miss 6' },
    { value: 2, label: 'Electician' },
    { value: 3, label: 'King Kong' },
    { value: 4, label: 'Rocketer' },
    { value: 5, label: 'Granos' },
    { value: 6, label: 'Chicky' },
    { value: 7, label: 'Tarzan' },
    { value: 8, label: 'Apache' },
    { value: 9, label: 'Magenta' },
];

const statsLabels = ['Sinh lực', 'Tấn công', 'Phòng thủ', 'May mắn', 'Đồng đội'];

const defaultValue = {
    cid: characterOptions[0].value, //characterId
    et: equipTypeOptions[0].value, //equipType
    ei: null, //equipIndex
    ap: [0, 0, 0, 0, 0], //addPoints
    apc: [0, 0, 0, 0, 0], //addPercents
};

const validationSchema = yup.object({
    cid: yup.number().required('Trường này là bắt buộc'),
    et: yup.number().required('Trường này là bắt buộc'),
    ei: yup.number().required('Trường này là bắt buộc'),
    ap: yup.array().of(yup.number().required('Trường này là bắt buộc')),
    apc: yup.array().of(yup.number().required('Trường này là bắt buộc')),
});

function EquipModal({ visible, handleCancel, onOk, initialValues = defaultValue }) {
    const [equips, setEquips] = useState([]);

    const handleEquipChange = (value) => {
        const selectedEquip = equips.find((e) => e.equipIndex === value);
        formik.setFieldValue('ei', value);
        formik.setFieldValue('ap', selectedEquip?.additionalPoints || Array(5).fill(0));
        formik.setFieldValue('apc', selectedEquip?.additionalPercent || Array(5).fill(0));
    };

    const handleSubmit = (values, { resetForm }) => {
        onOk(values);
        resetForm();
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
        enableReinitialize: true,
    });

    useEffect(() => {
        const fetchEquipments = async () => {
            const { cid, et } = formik.values;
            if (cid !== undefined && et !== undefined) {
                try {
                    const response = await getEquipsByCharacterIdAndType(cid, et);
                    setEquips(response.data.data);
                    formik.setFieldValue('ei', null);
                    formik.setFieldTouched('ei', false);
                } catch (error) {
                    console.error('Error fetching equipments:', error);
                }
            }
        };

        fetchEquipments();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formik.values.cid, formik.values.et]);

    const renderInputGroup = (name, values, touched, errors) => (
        <Flex wrap justify="space-around" gap="small">
            {values.map((value, index) => (
                <div key={index}>
                    <label htmlFor={`${name}.${index}`}>{statsLabels[index]}</label>
                    <InputNumber
                        id={`${name}.${index}`}
                        min={0}
                        max={100}
                        value={value}
                        onChange={(val) => formik.setFieldValue(`${name}.${index}`, val)}
                        onBlur={formik.handleBlur}
                        status={touched?.[index] && errors?.[index] ? 'error' : ''}
                    />
                    {touched?.[index] && errors?.[index] && <div className="text-danger">{errors[index]}</div>}
                </div>
            ))}
        </Flex>
    );

    return (
        <Modal title="Nhập dữ liệu trang bị" open={visible} onCancel={handleCancel} footer={null}>
            <form onSubmit={formik.handleSubmit}>
                <Flex justify="space-between" gap="small" className="mb-2">
                    <div>
                        <label htmlFor="cid">Nhân vật</label>
                        <Select
                            id="cid"
                            name="cid"
                            options={characterOptions}
                            value={formik.values.cid}
                            onChange={(value) => formik.setFieldValue('cid', value)}
                            onBlur={formik.handleBlur}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div>
                        <label htmlFor="et">Loại</label>
                        <Select
                            id="et"
                            name="et"
                            options={equipTypeOptions}
                            value={formik.values.et}
                            onChange={(value) => formik.setFieldValue('et', value)}
                            onBlur={formik.handleBlur}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div>
                        <label htmlFor="ei">Trang bị</label>
                        <Select
                            id="ei"
                            name="ei"
                            allowClear
                            options={equips}
                            fieldNames={{ label: 'name', value: 'equipIndex' }}
                            value={formik.values.ei}
                            onChange={handleEquipChange}
                            onBlur={formik.handleBlur}
                            status={formik.touched.ei && formik.errors.ei ? 'error' : ''}
                            style={{ width: '100%' }}
                        />
                        {formik.touched.ei && formik.errors.ei && <div className="text-danger">{formik.errors.ei}</div>}
                    </div>
                </Flex>

                <div className="form-group mb-2">
                    <span>Chỉ số</span>
                    {renderInputGroup('ap', formik.values.ap, formik.touched.ap, formik.errors.ap)}
                </div>

                <div className="form-group mb-2">
                    <span>Phần trăm</span>
                    {renderInputGroup('apc', formik.values.apc, formik.touched.apc, formik.errors.apc)}
                </div>

                <Flex justify="end" gap="small">
                    <Button onClick={handleCancel}>Đóng</Button>
                    <Button type="primary" htmlType="submit">
                        Lưu
                    </Button>
                </Flex>
            </form>
        </Modal>
    );
}
export default EquipModal;
