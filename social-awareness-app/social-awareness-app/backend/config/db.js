const mysql = require('mysql2/promise'); 


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'node_login',
    waitForConnections: true, 
    connectionLimit: 10, 
    queueLimit: 0 
});


(async () => {
    try {
        const connection = await pool.getConnection(); 
        console.log('Database connected.');
        connection.release(); 
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
})();

module.exports = pool;
