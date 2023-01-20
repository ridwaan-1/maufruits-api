class SqlQuery {
    constructor(tableName) {
        this.query = {
            'tableName': tableName
        };
    }

    
    /**
     * It takes a column name as an argument and adds it to the query object.
     * @String colToBeSelected - The columns to be selected('*' for all).
     * Aggregate functions are supported
     */
    select(colToBeSelected) {
        this.query = {
            'SELECT': colToBeSelected,
            ...this.query
        }
    }

    /**
     * It takes a string as an argument, and adds it to the WHERE clause of the query.
     * @param query - The query to be added to the WHERE clause.
     */
    where(query) {
        const prevQuery = this.query['WHERE'] ?? '';
        const newQuery = prevQuery.length > 0 ? `${prevQuery} AND ${query}` : query;
        this.query = {
            ...this.query,
            'WHERE': newQuery
        }
    }

    /**
     * It takes an array of strings and adds them to the WHERE clause of the query.
     * @param groupOr - Array of strings, each string is a condition.
     */
    whereGroupOr(groupOr) {
        const groupQuery = '(' + groupOr.join(' OR ') + ')';
        const prevQuery = this.query['WHERE'] ?? '';
        const newQuery = prevQuery.length > 0 ? `${prevQuery} AND ${groupQuery}` : groupQuery;
        this.query = {
            ...this.query,
            'WHERE': newQuery
        }
    }

    /**
     * It takes an array of strings and adds them to the query object.
     * @param rawQueryArr - An array of strings that contains all ordering query.
     */
    orderBy(rawQueryArr) {
        this.query = {
            ...this.query,
            'ORDER BY': rawQueryArr.join(',')
        }
    }

    /**
     * It takes a number as an argument and adds a LIMIT clause to the query object.
     * @param rowLimit - The number of rows to return.
     */
    limit(rowLimit) {
        this.query = {
            ...this.query,
            'LIMIT': rowLimit
        }
    }

    /**
     * The function takes an offset value and adds it to the query object.
     * @param offset - The number of rows to skip.
     */
    offset(offset) {
        this.query = {
            ...this.query,
            'OFFSET': offset
        }
    }

    /**
     * It takes the query object and returns a string that can be used to query a database.
     * @returns The result of the query.
     */
    getQuery() {
        let result = `SELECT ${this.query['SELECT']} FROM ${this.query['tableName']} `;
        const keys = Object.keys(this.query);
       
        for(let i=2; i<keys.length; i++) {
            result+= `${keys[i]} ${this.query[keys[i]]} `
        }

        return result;
    }

}

module.exports = SqlQuery;