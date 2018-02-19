const example = {
    pageNum: 0,
    pageSize: 10,
    total: 23,
    pageCnt: 3,
    records: [
    ]
}

/**
 * assemble record into paginated object
 * @param {Number} pageNum page index
 * @param {Number} pageSize page size
 * @param {Number} total total records count
 * @param {Array<Object>} records record list
 * @returns {Object} paginated data
 */
function assemblePaginatedResult(pageNum, pageSize, total, records) {
    let pageCnt = Math.floor(total / pageSize) + ((total % pageSize) === 0 ? 0 : 1)
    return {
        pageNum: pageNum,
        pageSize: pageSize,
        total: total,
        pageCnt: pageCnt,
        records: records
    }
}

exports = module.exports = assemblePaginatedResult
