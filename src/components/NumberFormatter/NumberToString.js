import PropTypes from 'prop-types';

const numberToVietnamese = (num) => {
    const units = ['', 'nghìn', 'triệu', 'tỷ'];
    const ones = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    const tens = [
        'mười',
        'hai mươi',
        'ba mươi',
        'bốn mươi',
        'năm mươi',
        'sáu mươi',
        'bảy mươi',
        'tám mươi',
        'chín mươi',
    ];

    if (typeof num !== 'number' || isNaN(num)) {
        throw new Error('Input must be a valid number');
    }

    if (num === 0) return 'không';

    const convert = (n) => {
        let result = '';

        if (n >= 100) {
            result += ones[Math.floor(n / 100)] + ' trăm ';
            n %= 100;
        }
        if (n >= 10) {
            result += tens[Math.floor(n / 10) - 1] + ' ';
            n %= 10;
        }
        if (n > 0) {
            result += ones[n];
        }
        return result.trim();
    };

    let str = '';
    let unitIndex = 0;
    while (num > 0) {
        const part = num % 1000;
        if (part > 0) {
            str = convert(part) + ' ' + (units[unitIndex] || '') + ' ' + str;
        }
        num = Math.floor(num / 1000);
        unitIndex++;
    }

    return str.trim();
};

function NumberToString({ number }) {
    return <>{numberToVietnamese(number)}</>;
}

NumberToString.propTypes = {
    number: PropTypes.number.isRequired,
};

export default NumberToString;
