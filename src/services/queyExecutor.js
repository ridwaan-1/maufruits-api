const dbconn = require("../config/db.js");

/**
 * It takes a query as a parameter, executes it, and returns a promise that resolves to the rows
 * returned by the query
 * @param query - The query to be executed.
 * @returns A promise that resolves to an array of rows.
 */
exports.sqlQueryExecutor = async  (query) => {
    const conn = await dbconn(); 
    const [rows, fields] = await conn.query(query);
    await conn.end();
    return rows;
}

/* A function that takes a callback function as a parameter. It creates a connection to the database,
starts a transaction, executes the callback function, commits the transaction, and closes the
connection. */
exports.sqlTransactionExecutor = async (callback) => {
    const conn = await dbconn(); 
    await conn.beginTransaction();
    try {
        await callback(conn);
        await conn.commit();
    } catch (err) {
        console.log(err);
        conn.rollback();
        throw new Error('Error processing order')
    } finally {
        await conn.end();
    }
}