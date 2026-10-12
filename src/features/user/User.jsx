import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

function User() {
  // Pull the setter function from the outlet context
  const { setFooterText } = useOutletContext();

  useEffect(() => {
    setFooterText('Manage user accounts');
  }, [setFooterText]);

  return (
    <div>
      <p>Users</p>
    </div>
  );
}

export default User;
