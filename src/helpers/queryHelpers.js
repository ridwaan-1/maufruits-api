const mysql = require("mysql2");
const SqlQuery = require('./SqlQuery');

/* A function that takes an object which contains all queries configuration and then return a string
   corresponding to the sql query.
   Note: For products details only. 
*/
exports.queryCreatorProduct = (config) => {
    const { tableName, id, page=1, limit=15, price='', grade='', stock='', name='', sort=[], additionalQuery='' } = config;
    
    const infoQuery = new SqlQuery(tableName);
    const counterQuery = new SqlQuery(tableName);
    
    infoQuery.select('*');
    counterQuery.select(`COUNT(${id}) as num`);

    if(additionalQuery) {
        infoQuery.where(additionalQuery);
        counterQuery.where(additionalQuery);
    }

    if(grade) {
        const grades = grade.split(',').map(g => mysql.escape(g)).join(',');
        infoQuery.where(`grade IN (${grades})`);
        counterQuery.where(`grade IN (${grades})`);
    }
    if(name) {
        infoQuery.whereGroupOr([`name LIKE '%${name}%'`, `${id} LIKE '%${name}'`]);
        counterQuery.whereGroupOr([`name LIKE '%${name}%'`, `${id} LIKE '${name}%'`]);
    }
    if(price) sort.push(`sellingPrice ${price}`);
    if(stock) sort.push(`numInStock ${stock}`);

    if(sort.length>0) infoQuery.orderBy(sort); 

    infoQuery.limit(limit);
    infoQuery.offset((page - 1) * limit);
   
    return { 
        infoQuery: infoQuery.getQuery(), 
        counterQuery: counterQuery.getQuery() 
    }
}

/* A function that takes an object which contains all queries configuration and then return a string
   corresponding to the sql query.
   Note: For order details only. 
*/
exports.queryCreatorOrder = (config) => {
    const { colId, tableName, page=1, limit=15, id='', status='', price='', quantity='', date='', paymentType='', deliveryMethod='', sort=[] } = config;
    
    const infoQuery = new SqlQuery(tableName);
    const counterQuery = new SqlQuery(tableName);
    
    infoQuery.select('*');
    counterQuery.select(`COUNT(${colId}) as num`);

    if(id) {
        infoQuery.where(`order_id LIKE '${id}%'`);
        counterQuery.where(`order_id LIKE '${id}%'`);
    }
    if(status) {
        infoQuery.where(`orderStatus='${status}'`);
        counterQuery.where(`orderStatus='${status}'`);
    }
    if(paymentType) {
        infoQuery.where(`paymentType='${paymentType}'`);
        counterQuery.where(`paymentType='${paymentType}'`);
    }
    if(deliveryMethod) {
        infoQuery.where(`deliveryMethod='${deliveryMethod}'`);
        counterQuery.where(`deliveryMethod='${deliveryMethod}'`);
    }
    if(price) sort.push(`totalPrice ${price}`);
    if(date) sort.push(`orderDate ${date}`);
    if(quantity) sort.push(`quantity ${quantity}`);

    if(sort.length>0) infoQuery.orderBy(sort); 

    infoQuery.limit(limit);
    infoQuery.offset((page - 1) * limit);
    
    return { 
        infoQuery: infoQuery.getQuery(), 
        counterQuery: counterQuery.getQuery() 
    }
}