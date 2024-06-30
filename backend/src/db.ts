import oracledb from 'oracledb';

const config = {
  user: 'sys',
  password: 'admin',
  connectString: 'localhost/internship',
};

export async function initialize() {
  try {
    await oracledb.createPool(config);
    console.log('Oracle Database connection pool created');
  } catch (err) {
    console.error('Error creating Oracle Database connection pool', err);
  }
}

export async function close() {
  try {
    await oracledb.getPool().close(10);
    console.log('Oracle Database connection pool closed');
  } catch (err) {
    console.error('Error closing Oracle Database connection pool', err);
  }
}

export async function execute(query: string, binds: any = [], options: any = {}) {
  let conn;
  options.outFormat = oracledb.OUT_FORMAT_OBJECT;

  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(query, binds, options);
    return result;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error('Error closing connection', err);
      }
    }
  }
}