// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

//    function MyComponent() {
//      const [message, setMessage] = useState('');

//      useEffect(() => {
//        axios.get('/api')
//          .then(response => {
//            setMessage(response.data.message);
//          })
//          .catch(error => {
//            console.error('There was an error!', error);
//          });
//      }, []);

//      return (
//        <div>
//          <h1>{message}</h1>
//        </div>
//      );
//    }

// export default MyComponent;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MyComponent() {
  const [message, setMessage] = useState('Loading...');
  const [inputData, setInputData] = useState('');

  useEffect(() => {
    axios.get('/api')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });

    const dataToSend = { data: inputData }; // Use the inputData state as the data to send

    axios.post('/api', dataToSend)
      .then(response => {
        console.log('Response from server:', response.data.message);
      })
      .catch(error => {
        console.error('Error sending data to server:', error);
      });
  }, [inputData]);

  const handleInputChange = event => {
    setInputData(event.target.value);
  };

  return (
    <div>
      <h1>{message}</h1>
      <input type="text" value={inputData} onChange={handleInputChange} />
    </div>
  );
}

export default MyComponent;
