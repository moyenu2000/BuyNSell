import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
// import UserProvider from './context/UserProvider'; 
import Dashboard from './pages/Dashboard';
import Signup from './pages/signUp';
import Login from './pages/loginPage';
import ProductList from './components/Products';
import AddProduct from './pages/AddProducts';
// import PrivateRoute from './context/PrivateRoute';

function App() {
  return (
    <Router>
      {/* <UserProvider> */}
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* <PrivateRoute path="/add-product" component={AddProduct} /> */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Login />} />
        <Route path="/products" element={<ProductList />}/>
        <Route path="/addproduct" element={<AddProduct />}/>

        {/* <Route path="/addProduct" element={<AddProduct />}/> */}
      </Routes>
      {/* </UserProvider> */}
    </Router>
  );
}

export default App;

// import React from 'react';
// import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
// import UserProvider from './context/UserProvider';
// import UserContext from './context/UserContext';
// import Dashboard from './pages/Dashboard';
// import Signup from './pages/signUp';
// import Login from './pages/loginPage';
// import ProductList from './components/Products';
// import AddProduct from './pages/AddProducts';
// import { useContext } from 'react';

// function App() {
//   const { user1 } = useContext(UserContext);

//   return (
//     <Router>
//       <UserProvider>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/dashboard" element={
//             <UserContext.Consumer>
//               {({ user }) => user ? <Dashboard /> : <Login />}
//             </UserContext.Consumer>
//           } />
//           <Route path="/" element={<Login />} />
//           <Route path="/products" element={
//             <UserContext.Consumer>
//               {({ user }) => user ? <ProductList /> : <Login />}
//             </UserContext.Consumer>
//           } />
//           <Route path="/add-product" element={
//             <UserContext.Consumer>
//               {({ user }) => user ? <AddProduct /> : <Login />}
//             </UserContext.Consumer>
//           } />
//         </Routes>
//       </UserProvider>
//     </Router>
//   );
// }

// export default App;
