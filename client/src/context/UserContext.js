import  { createContext} from 'react';

const UserContext = createContext({
  userID: null,
  email: '',
  firstName: '',
  lastName: '',
  locationID: null,
  reported: null,
  image: '',
  updateUser: () => {},  
});

export default UserContext;