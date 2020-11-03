import React, { useState } from 'react';
import DashboardPage from './DashboardPage';
import { useMutation } from '@apollo/react-hooks';
import DashboardSelector from '../components/DashboardSelector';
import { GET_DASHBOARD_ITEMS } from '../graphql/queries';
import { UPDATE_DASHBOARD} from '../graphql/mutations';

const getDashboardList = () =>
  JSON.parse(window.localStorage.getItem('dashboardList')) ||
  [];

const DashboardSelectorPage = () => {

  const [updateDashboard] = useMutation(UPDATE_DASHBOARD, {
    refetchQueries: [
      {
        query: GET_DASHBOARD_ITEMS,
      },
    ],
  });

  const [selectedDashboard, setSelectedDashboard] = useState();

  const onChange = (item) => { 
    setSelectedDashboard(item); 
    updateDashboard({
      variables: {
        id: item?.id,
      },
    });
  }

  return (
    <>
      <div style={{ textAlign: 'right', margin: '16px 16px 0 0' }}>
        <DashboardSelector buttonVisible={true} onChange={onChange} />
      </div>
      <div>
        {(selectedDashboard) && <DashboardPage />}
      </div>
    </>
  );
};

export default DashboardSelectorPage;