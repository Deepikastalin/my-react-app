import React from 'react';
import { HeaderContainer } from '../styles/StyledComponents';

const Header = () => {
  // Get current date in a readable format
  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long', // e.g. Thursday
    year: 'numeric',  // e.g. 2025
    month: 'long',    // e.g. June
    day: 'numeric'    // e.g. 4
  });

  return (
    <HeaderContainer>
      <h1>Billing App</h1>
      <p>{currentDate}</p>
    </HeaderContainer>
  );
};

export default Header;

