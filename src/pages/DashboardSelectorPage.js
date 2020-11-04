import React, { useState } from 'react';
import DashboardPage from './DashboardPage';
import { useMutation } from '@apollo/react-hooks';
import DashboardSelector from '../components/DashboardSelector';
import { GET_DASHBOARD_ITEMS } from '../graphql/queries';
import { UPDATE_DASHBOARD } from '../graphql/mutations';
import { Button, Modal, Input } from 'antd';
import { v4 as uuidv4 } from 'uuid';

const getDashboardList = () =>
  JSON.parse(window.localStorage.getItem('dashboardList')) ||
  [];

const DashboardSelectorPage = () => {
  const [refresh, setRefresh] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [dashboardName, setDashboardName] = useState();

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
  };

  const handleCreateDashboardButton = () => {
    const newDashboard = { id: uuidv4(), name: dashboardName, dashboardItems: [] };
    const items = [...getDashboardList(), newDashboard];
    window.localStorage.setItem('dashboardList', JSON.stringify(items));
    setRefresh(prev => !prev);
    setSelectedDashboard(newDashboard);
    setDashboardName();
    setModalVisible(false);
  };

  const handleDeleteDashboardButton = () => {
    const items = getDashboardList().filter(item => item.id !== selectedDashboard.id);
    window.localStorage.setItem('dashboardList', JSON.stringify(items));
    setRefresh(prev => !prev);
    setSelectedDashboard();
  };

  return (
    <>
      <div style={{ textAlign: 'right', margin: '16px 16px 0 0' }}>
        <DashboardSelector onChange={onChange} refresh={refresh} />
        <Button onClick={() => setModalVisible(true)}
          style={{ marginLeft: '8px' }} type="primary">
          Add New Dashboard
        </Button>
        <Button onClick={() =>
          Modal.confirm({
            title: 'Are you sure you want to delete this dashboard?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
              handleDeleteDashboardButton();
            },
          })
        }
          style={{ marginLeft: '8px' }} hidden={!selectedDashboard}
          type="primary" danger>
          Delete Dashboard
        </Button>
      </div>
      <div>
        {(selectedDashboard) && <DashboardPage />}
      </div>
      <Modal
        key="modal"
        title="Create Dashboard"
        visible={modalVisible}
        onOk={handleCreateDashboardButton}
        onCancel={() => setModalVisible(false)}
      >
        <Input
          placeholder="Dashboard Name"
          value={dashboardName}
          onChange={(e) => setDashboardName(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default DashboardSelectorPage;