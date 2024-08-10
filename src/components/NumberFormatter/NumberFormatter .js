import PropTypes from 'prop-types';

function NumberFormatter({ number = 0 }) {
    const formattedNumber = number.toLocaleString();

    return <>{formattedNumber}</>;
}

NumberFormatter.propTypes = {
    number: PropTypes.number,
};

export default NumberFormatter;
