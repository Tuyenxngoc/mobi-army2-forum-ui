import PropTypes from 'prop-types';
import Style from './Pagination.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(Style);

function showCurrentPage(page) {
    return page + 1;
}

function Pagination({ totalPages, currentPage, onPageChange }) {

    return (
        <div className={cx('wrapper')}>
            {currentPage > 0 &&
                <>
                    <button className={cx('button')} onClick={() => onPageChange(0)}>
                        &laquo;
                    </button>
                    <button className={cx('button')} onClick={() => onPageChange(currentPage - 1)}>
                        &lsaquo;
                    </button>
                </>
            }

            {currentPage - 1 >= 0 &&
                <button className={cx('button')} onClick={() => onPageChange(currentPage - 1)}>
                    {showCurrentPage(currentPage - 1)}
                </button>
            }

            <button className={cx('button', 'active')}>
                {showCurrentPage(currentPage)}
            </button>

            {currentPage + 1 < totalPages &&
                <button className={cx('button')} onClick={() => onPageChange(currentPage + 1)}>
                    {showCurrentPage(currentPage + 1)}
                </button>
            }
            {currentPage + 2 < totalPages &&
                <button className={cx('button')} onClick={() => onPageChange(currentPage + 2)}>
                    {showCurrentPage(currentPage + 2)}
                </button>
            }

            {currentPage + 1 === totalPages ||
                <>
                    <button className={cx('button')} onClick={() => onPageChange(currentPage + 1)}>
                        &rsaquo;
                    </button>
                    <button className={cx('button')} onClick={() => onPageChange(totalPages - 1)}>
                        &raquo;
                    </button>
                </>
            }
        </div>
    );
}

Pagination.propTypes = {
    totalPages: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};


export default Pagination;