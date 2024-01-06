import React, { useEffect } from 'react';

const Redirect = () => {
  // Definește link-ul către care vrei să redirecționezi
  const redirectLink = 'https://facebook.com';

 

  useEffect(() => {
    // Redirecționează automat la accesarea paginii
    window.location.href = redirectLink;
  }, []); // [] asigură că efectul este apelat doar o dată la montarea componentei

  return (
    <div id='facebook-content'>
      <div id='face-first'>
        <strong>facebook</strong>
        <p id='face-two'>Connect with friends and the world around you on Facebook.</p>

      </div>
    </div>
  );
};

export default Redirect;
