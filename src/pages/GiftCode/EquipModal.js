import { Modal, Input, InputNumber, Form } from 'antd';

function EquipModal({ visible, onCancel, onOk }) {
    const [form] = Form.useForm();

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                onOk(values);
                form.resetFields();
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            title="Nhập dữ liệu Equip"
            visible={visible}
            onCancel={onCancel}
            onOk={handleOk}
            okText="Xác nhận"
            cancelText="Hủy"
        >
            <Form form={form} layout="vertical" name="equipForm">
                <Form.Item name="k" label="K" rules={[{ required: true, message: 'Vui lòng nhập K!' }]}>
                    <InputNumber min={0} max={100} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item name="ei" label="EI" rules={[{ required: true, message: 'Vui lòng nhập EI!' }]}>
                    <InputNumber min={0} max={100} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item name="et" label="ET" rules={[{ required: true, message: 'Vui lòng nhập ET!' }]}>
                    <Input placeholder="Nhập ET" />
                </Form.Item>

                <Form.Item name="vl" label="VL" rules={[{ required: true, message: 'Vui lòng nhập VL!' }]}>
                    <Input placeholder="Nhập VL" />
                </Form.Item>

                <Form.Item name="pd" label="PD" rules={[{ required: true, message: 'Vui lòng chọn PD!' }]}>
                    <Input type="datetime-local" />
                </Form.Item>

                <Form.Item name="cid" label="CID" rules={[{ required: true, message: 'Vui lòng nhập CID!' }]}>
                    <Input placeholder="Nhập CID" />
                </Form.Item>

                <Form.Item name="iu" label="IU" rules={[{ required: true, message: 'Vui lòng nhập IU!' }]}>
                    <Input placeholder="Nhập IU" />
                </Form.Item>
            </Form>
        </Modal>
    );
}
export default EquipModal;
