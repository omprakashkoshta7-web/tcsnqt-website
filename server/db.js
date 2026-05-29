const initSqlJs = require("sql.js");
const fs = require("fs");
const path = require("path");

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "data.db");
let db = null;
let SQL = null;

function createWrapper(sqlDb) {
  return {
    prepare(sql) {
      let stmt = null;
      return {
        run(...params) {
          if (params.length > 0) {
            stmt = sqlDb.prepare(sql);
            stmt.bind(params);
            stmt.step();
            const changes = sqlDb.getRowsModified();
            const lastIdResult = sqlDb.exec("SELECT last_insert_rowid() as id");
            const lastInsertRowid = lastIdResult.length > 0 ? lastIdResult[0].values[0][0] : 0;
            if (stmt) stmt.free();
            stmt = null;
            return { lastInsertRowid, changes };
          }
          sqlDb.run(sql);
          return { changes: sqlDb.getRowsModified() };
        },
        all(...params) {
          if (params.length > 0) {
            stmt = sqlDb.prepare(sql);
            stmt.bind(params);
            const rows = [];
            while (stmt.step()) rows.push(stmt.getAsObject());
            stmt.free();
            stmt = null;
            return rows;
          }
          const result = sqlDb.exec(sql);
          if (!result || result.length === 0) return [];
          const { columns, values } = result[0];
          return values.map((row) => {
            const obj = {};
            columns.forEach((col, i) => (obj[col] = row[i]));
            return obj;
          });
        },
        get(...params) {
          const rows = this.all(...params);
          return rows.length > 0 ? rows[0] : undefined;
        },
      };
    },
    run(sql, params) {
      sqlDb.run(sql, params || []);
    },
    exec(sql) {
      sqlDb.exec(sql);
    },
    close() {
      sqlDb.close();
    },
    export() {
      return sqlDb.export();
    },
    getRowsModified() {
      return sqlDb.getRowsModified();
    },
  };
}

async function getDb() {
  if (db) return db;
  if (!SQL) SQL = await initSqlJs();
  try {
    if (fs.existsSync(DB_PATH)) {
      const buffer = fs.readFileSync(DB_PATH);
      db = createWrapper(new SQL.Database(buffer));
    } else {
      db = createWrapper(new SQL.Database());
    }
  } catch {
    db = createWrapper(new SQL.Database());
  }
  initSchema();
  return db;
}

function persistDb() {
  if (!db) return;
  try {
    const data = db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  } catch (err) {
    console.error("DB persist error:", err.message);
  }
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL UNIQUE,
      product TEXT NOT NULL,
      price REAL NOT NULL,
      utr TEXT NOT NULL,
      date TEXT NOT NULL,
      timestamp TEXT NOT NULL DEFAULT (datetime('now')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  persistDb();
}

module.exports = { getDb, persistDb };
