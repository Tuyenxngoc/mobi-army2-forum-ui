import { Link } from 'react-router-dom';
import { Button, InputNumber, message, Spin } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { handleError } from '~/utils/errorHandler';
import { useEffect, useState } from 'react';
import { getPlayerCharacter, getPlayerPoints, updatePoints } from '~/services/playerService';

const defaultValue = {
    playerCharacterId: 0,
    health: 0,
    damage: 0,
    defense: 0,
    luck: 0,
    teammates: 0,
};

const validationSchema = yup.object({
    playerCharacterId: yup.number().required('ID nhân vật không được để trống'),

    health: yup
        .number()
        .required('Sức khỏe không được để trống')
        .integer('Sức khỏe phải là số nguyên')
        .min(0, 'Sức khỏe phải là số không âm'),

    damage: yup
        .number()
        .required('Sát thương không được để trống')
        .integer('Sát thương phải là số nguyên')
        .min(0, 'Sát thương phải là số không âm'),

    defense: yup
        .number()
        .required('Phòng thủ không được để trống')
        .integer('Phòng thủ phải là số nguyên')
        .min(0, 'Phòng thủ phải là số không âm'),

    luck: yup
        .number()
        .required('May mắn không được để trống')
        .integer('May mắn phải là số nguyên')
        .min(0, 'May mắn phải là số không âm'),

    teammates: yup
        .number()
        .required('Số đồng đội không được để trống')
        .integer('Số đồng đội phải là số nguyên')
        .min(0, 'Số đồng đội phải là số không âm'),
});

function UpdragePoinst() {
    const [playerPoints, setPlayerPoints] = useState({});
    const [characterList, setCharacterList] = useState([]);

    const [isLoadingCharacters, setIsLoadingCharacters] = useState(true);
    const [characterError, setCharacterError] = useState(null);

    const [isLoadingPoints, setIsLoadingPoints] = useState(true);
    const [pointsError, setPointsError] = useState(null);

    const [messageApi, contextHolder] = message.useMessage();

    const handleCharacterChange = (event) => {
        const newCharacterId = event.target.value;
        formik.setFieldValue('playerCharacterId', newCharacterId);
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await updatePoints(values);
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
        const fetchPlayerCharacter = async () => {
            setIsLoadingCharacters(true);
            setCharacterError(null);
            try {
                const response = await getPlayerCharacter();
                const arr = response.data.data;
                setCharacterList(arr);

                formik.setFieldValue('playerCharacterId', arr[0].id);
            } catch (error) {
                setCharacterError(error.message);
            } finally {
                setIsLoadingCharacters(false);
            }
        };

        fetchPlayerCharacter();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const fetchPoints = async () => {
            setIsLoadingPoints(true);
            setPointsError(null);
            try {
                const response = await getPlayerPoints(formik.values.playerCharacterId);
                const pointsData = response.data.data;

                setPlayerPoints(pointsData);
            } catch (error) {
                setPointsError(error.message);
            } finally {
                setIsLoadingPoints(false);
            }
        };

        if (formik.values.playerCharacterId) {
            fetchPoints();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formik.values.playerCharacterId]);

    const renderContent = () => {
        if (isLoadingCharacters) {
            return (
                <div className="alert alert-primary m-2 p-2" role="alert">
                    Loading... <Spin />
                </div>
            );
        }

        if (characterError) {
            return (
                <div className="alert alert-danger m-2 p-2" role="alert">
                    Lỗi: {characterError}
                </div>
            );
        }

        if (isLoadingPoints) {
            return (
                <div className="alert alert-primary m-2 p-2" role="alert">
                    Loading... <Spin />
                </div>
            );
        }

        return (
            <div className="p-2">
                <form onSubmit={formik.handleSubmit}>
                    <div className="form-group mb-2">
                        <label htmlFor="playerCharacterId">Nhân vật</label>
                        <select
                            className="form-control"
                            id="playerCharacterId"
                            value={formik.values.playerCharacterId}
                            onChange={handleCharacterChange}
                            onBlur={formik.handleBlur}
                            name="categoryId"
                        >
                            {characterList.map((character) => (
                                <option key={character.id} value={character.id}>
                                    {character.name}
                                </option>
                            ))}
                        </select>
                        {formik.touched.playerCharacterId && formik.errors.playerCharacterId ? (
                            <div className="text-danger">{formik.errors.playerCharacterId}</div>
                        ) : null}
                    </div>

                    <div className="form-group mb-2">
                        <label htmlFor="health">Sinh lực: {playerPoints.health}</label>
                        <InputNumber
                            id="health"
                            min={0}
                            max={10000}
                            value={formik.values.health}
                            onChange={(value) => formik.setFieldValue('health', value)}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.health && formik.errors.health ? (
                            <div className="text-danger">{formik.errors.health}</div>
                        ) : null}
                    </div>

                    <div className="form-group mb-2">
                        <label htmlFor="damage">Sát thương: {playerPoints.damage}</label>
                        <InputNumber
                            id="damage"
                            min={0}
                            max={10000}
                            value={formik.values.damage}
                            onChange={(value) => formik.setFieldValue('damage', value)}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.damage && formik.errors.damage ? (
                            <div className="text-danger">{formik.errors.damage}</div>
                        ) : null}
                    </div>

                    <div className="form-group mb-2">
                        <label htmlFor="defense">Phòng thủ: {playerPoints.defense}</label>
                        <InputNumber
                            id="defense"
                            min={0}
                            max={10000}
                            value={formik.values.defense}
                            onChange={(value) => formik.setFieldValue('defense', value)}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.defense && formik.errors.defense ? (
                            <div className="text-danger">{formik.errors.defense}</div>
                        ) : null}
                    </div>

                    <div className="form-group mb-2">
                        <label htmlFor="luck">May mắn: {playerPoints.luck}</label>
                        <InputNumber
                            id="luck"
                            min={0}
                            max={10000}
                            value={formik.values.luck}
                            onChange={(value) => formik.setFieldValue('luck', value)}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.luck && formik.errors.luck ? (
                            <div className="text-danger">{formik.errors.luck}</div>
                        ) : null}
                    </div>

                    <div className="form-group mb-2">
                        <label htmlFor="teammates">Đồng đội: {playerPoints.teammates}</label>
                        <InputNumber
                            id="teammates"
                            min={0}
                            max={10000}
                            value={formik.values.teammates}
                            onChange={(value) => formik.setFieldValue('teammates', value)}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.teammates && formik.errors.teammates ? (
                            <div className="text-danger">{formik.errors.teammates}</div>
                        ) : null}
                    </div>

                    <div className="text-center">
                        <Button type="primary" htmlType="submit" loading={formik.isSubmitting}>
                            Cộng
                        </Button>
                    </div>
                </form>
            </div>
        );
    };

    return (
        <div className="box-container">
            {contextHolder}
            <div className="forum-header">
                <Link to="/player/info">Quay lại</Link>
            </div>

            {renderContent()}
        </div>
    );
}

export default UpdragePoinst;
