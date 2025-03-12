import { Component } from 'react';

class Users extends Component{
    render() {
        return (
          <loginPage>
            <form>
              <input type="text" placeholder="Enter your username" />
              <input type="password" placeholder="Secret passphrase" />
              <button type="submit">Access Portal</button>
            </form>
            <div class="socialLinks">
              <a href="#">Connect via Facebook</a>
              <a href="#">Join with Google</a>
              <a href="#">Sign in with Twitter</a>
            </div>
          </loginPage>
        );
      };
      
     
}

  

export default Users;