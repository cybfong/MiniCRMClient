import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

function Dashboard() {
  // Pull the setter function from the outlet context
  const { setFooterText, setOptionalFooterText, setOptionalFooterStyle } =
    useOutletContext();

  useEffect(() => {
    setFooterText('Dashboard customer summary');
    setOptionalFooterText('');
    setOptionalFooterStyle('');
  }, [setFooterText, setOptionalFooterText, setOptionalFooterStyle]);

  return (
    <div>
      <p>Dashboard</p>
    </div>
  );
}

export default Dashboard;
