
let exportsList={};

let data = [
    {
      id: 1,
      name: "Guy Hawkins",
      age: 27,
      country: "Haiti",
    },
    {
      id: 2,
      name: "Jane Cooper",
      age: 19,
      country: "Monaco",
    },
    {
      id: 3,
      name: "Jacob Jones",
      age: 32,
      country: "Poland",
    },
    {
      id: 4,
      name: "Cody Fishers",
      age: 29,
      country: "Mexico",
    },
    {
      id: 5,
      name: "Brooklyn Simmons",
      age: 25,
      country: "USA",
    },
    {
      id: 6,
      name: "Esther Howard",
      age: 26,
      country: "Spain",
    },
    {
      id: 7,
      name: "Annette Black",
      age: 22,
      country: "UK",
    },
    {
      id: 8,
      name: "Marvin McKinney",
      age: 30,
      country: "Germany",
    },
  ];



import path from 'path';
import oraceldb from 'oracledb';

const PORT = 3000;

const dbConfig = {
    user: 'PROJECT12',
    password: '12345',
    connectString: 'localhost/orclpdb'
  };

  async function runQuery() {
    let connection;
    let result;
  
    try {
      connection = await oracledb.getConnection(dbConfig);
      const query = 'SELECT * FROM Category ';
      result = await connection.execute(query, { autoCommit: true });
  
      console.log('Query result:', result.rows);
    } catch (err) {
      console.error('Error executing query:', err);
    } finally {
      if (connection) {
        try {
          await connection.close();
          console.log('Connection closed.');
        } catch (err) {
          console.error('Error closing Oracle database connection:', err);
        }
      }
    }

    return result;
  }

runQuery();

 let updateDataBase=(newData)=>
  {
      data=newData;
      console.log(data);
  }

  exportsList.data=data;
  exportsList.updateDataBase=updateDataBase;
  
  export default exportsList;