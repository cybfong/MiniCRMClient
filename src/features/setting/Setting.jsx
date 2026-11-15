import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

function Setting() {
  // Pull the setter function from the outlet context
  const { setFooterText, setOptionalFooterText, setOptionalFooterStyle } =
    useOutletContext();

  useEffect(() => {
    setFooterText('Manage user settings');
    setOptionalFooterText('');
    setOptionalFooterStyle('');
  }, [setFooterText, setOptionalFooterText, setOptionalFooterStyle]);

  return (
    <div>
      <p>Settings</p>
    </div>
  );
}

export default Setting;
