import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

function Dashboard() {
  // Pull the setter function from the outlet context
  const { setFooterText } = useOutletContext();

  useEffect(() => {
    setFooterText('Dashboard customer summary');
  }, [setFooterText]);

  return (
    <div>
      <p>Dashboard</p>
    </div>
  );
}

export default Dashboard;
