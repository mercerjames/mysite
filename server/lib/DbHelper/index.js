import mysql from "mysql";

let pool = mysql.createPool(require("./../../config"));

function query(sql,params){
    return new Promise((resolve,reject)=>{
        pool.getConnection((err,conn)=>{
            if(err){
                reject(err);
                //throw err;
            }
            conn.query(sql,params,(err,result,fields)=>{
                conn.release();
                if(err){
                    reject(err);
                    //throw err;
                }
                resolve(result);
            })
        })
    })
}

async function queryAsync(){
    return await query(...arguments);
}

module.exports={
    query,
    queryAsync
}