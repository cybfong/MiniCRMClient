import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

function User() {
  // Pull the setter function from the outlet context
  const { setFooterText, setOptionalFooterText, setOptionalFooterStyle } =
    useOutletContext();

  useEffect(() => {
    setFooterText('Manage user accounts');
    setOptionalFooterText('');
    setOptionalFooterStyle('');
  }, [setFooterText, setOptionalFooterText, setOptionalFooterStyle]);

  return (
    <div>
      <p>Users</p>
    </div>
  );
}

export default User;
