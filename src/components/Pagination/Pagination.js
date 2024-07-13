import PropTypes from 'prop-types';
import Style from './Pagination.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(Style);

function showCurrentPage(page) {
    return page + 1;
}

function Pagination({ totalPages = 1, currentPage = 1, rowsPerPage = 10, onPageChange, onRowsPerPageChange }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('rows-per-page')}>
                <label htmlFor="rowsPerPage">Số dòng mỗi trang: </label>
                <select id="rowsPerPage" value={rowsPerPage} onChange={onRowsPerPageChange}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
            </div>

            <div className={cx('pagination-controls')}>
                {currentPage > 0 && (
                    <>
                        <button className={cx('button')} onClick={() => onPageChange(0)}>
                            &laquo;
                        </button>
                        <button className={cx('button')} onClick={() => onPageChange(currentPage - 1)}>
                            &lsaquo;
                        </button>
                    </>
                )}

                {currentPage - 1 >= 0 && (
                    <button className={cx('button')} onClick={() => onPageChange(currentPage - 1)}>
                        {showCurrentPage(currentPage - 1)}
                    </button>
                )}

                <button className={cx('button', 'active')}>{showCurrentPage(currentPage)}</button>

                {currentPage + 1 < totalPages && (
                    <button className={cx('button')} onClick={() => onPageChange(currentPage + 1)}>
                        {showCurrentPage(currentPage + 1)}
                    </button>
                )}
                {currentPage + 2 < totalPages && (
                    <button className={cx('button')} onClick={() => onPageChange(currentPage + 2)}>
                        {showCurrentPage(currentPage + 2)}
                    </button>
                )}

                {currentPage + 1 === totalPages || (
                    <>
                        <button className={cx('button')} onClick={() => onPageChange(currentPage + 1)}>
                            &rsaquo;
                        </button>
                        <button className={cx('button')} onClick={() => onPageChange(totalPages - 1)}>
                            &raquo;
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

Pagination.propTypes = {
    totalPages: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onRowsPerPageChange: PropTypes.func.isRequired,
};

export default Pagination;
