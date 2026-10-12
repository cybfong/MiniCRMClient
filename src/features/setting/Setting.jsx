import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

function Setting() {
  // Pull the setter function from the outlet context
  const { setFooterText } = useOutletContext();

  useEffect(() => {
    setFooterText('Manage user settings');
  }, [setFooterText]);

  return (
    <div>
      <p>Settings</p>
    </div>
  );
}

export default Setting;
