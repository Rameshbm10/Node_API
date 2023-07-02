import mysql, { ConnectionConfig, Connection } from 'mysql';

const dbConfig: ConnectionConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'contactDB',
};

const connection: Connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

connection.end((err) => {
  if (err) {
    console.error('Error closing the database connection:', err);
    return;
  }
  console.log('Database connection closed');
});

export default connection;
