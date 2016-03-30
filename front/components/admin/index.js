import React from 'react';
import { Link } from 'react-router';
import NavButton from '../common/navbutton';

class Admin extends React.Component {
  render() {
    return(
      <div>
        <Link to="/" style={styles}><NavButton /></Link>
      </div>
    );
  }
}

const styles = {
  color: "black",
  textDecoration: "none"
};

export default Admin;
