import oracledb from 'oracledb';


export const dbConfig = {
    user: 'projectdb',
    password: '12345',
    connectString: 'localhost/orclpdb'
};

async function connectToDatabase() {
    try {
        const connection = await oracledb.getConnection(dbConfig);
        console.log('Connected to the database!');
        return connection;
    } catch (err) {
        console.error('Error connecting to the database:', err);
        throw err;
    }
}

export default connectToDatabase;
