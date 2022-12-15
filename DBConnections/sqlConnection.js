const mysql = require("mysql");
dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'db_name',
    port: 3306,
    connectionLimit: 500
};  

let connection = mysql.createConnection(dbConfig);
connection.connect((err) => {
    if (err) {
      console.log("Mysql Database connection failed", err);
    } else {
      console.log("Mysql Database connected ");
    }
});

process.on('SIGINT', async () => { 
    connection.end();
    process.exit(0);
})

exports.pool = connection