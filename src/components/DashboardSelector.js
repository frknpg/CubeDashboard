import React, { useState, useEffect } from 'react';
import { Select, Button } from 'antd';
import { v4 as uuidv4 } from 'uuid';

const { Option } = Select;

const getDashboardList = () =>
  JSON.parse(window.localStorage.getItem('dashboardList')) ||
  [];

const DashboardSelector = ({ buttonVisible, onChange }) => {

  const [dashboardList, setDashboardList] = useState([]);

  useEffect(() => {
    setDashboardList(getDashboardList());
  }, []);

  const onChangeDashboard = (value) => {
    const dashboard = dashboardList.find(item => item.id === value);
    if (dashboard) {
      onChange(dashboard);
      window.localStorage.setItem('dashboardUUID', JSON.stringify(value));
    }
  };

  const handleCreateDashboardButton = () => {
    const newDashboard = { id: uuidv4(), dashboardItems: [] };
    const items = [...dashboardList, newDashboard];
    window.localStorage.setItem('dashboardList', JSON.stringify(items));
    setDashboardList(getDashboardList());
  };

  return (
    <>
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Select a dashboard"
        optionFilterProp="children"
        onChange={onChangeDashboard}
      >
        {dashboardList.map((item, index) => (
          <Option value={item.id}>Dashboard {index + 1}</Option>
        ))}
      </Select>
      {buttonVisible && <Button onClick={handleCreateDashboardButton} style={{ marginLeft: '8px' }} type="primary" >Add Dashboard</Button>}
    </>
  );
};

export default DashboardSelector;