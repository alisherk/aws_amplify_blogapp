import { API } from 'aws-amplify';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    callApi();
  }, []);

  async function callApi() {
    try {
      const peopleData = await API.get('mainappapi', '/people', null);
      console.log('peoplData', peopleData); 
    } catch (error) {
      console.log(error);
    }
  }
  return <div className='MainContainer'>

  </div>;
}

export default App;
