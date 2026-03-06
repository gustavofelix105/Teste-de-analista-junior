const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function getDbConnection() {
    const db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS Orders (
            orderId TEXT PRIMARY KEY,
            value REAL NOT NULL,
            creationDate TEXT NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS Items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            orderId TEXT NOT NULL,
            productId TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            FOREIGN KEY (orderId) REFERENCES Orders (orderId) ON DELETE CASCADE
        );
    `);

    return db;
}

module.exports = { getDbConnection };
