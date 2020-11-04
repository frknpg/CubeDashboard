import React, { useState, useEffect } from 'react';
import { Select } from 'antd';

const { Option } = Select;

const getDashboardList = () =>
  JSON.parse(window.localStorage.getItem('dashboardList')) ||
  [];

const DashboardSelector = ({ onChange, refresh, value, onClear }) => {

  const [dashboardList, setDashboardList] = useState([]);

  useEffect(() => {
    setDashboardList(getDashboardList());
  }, [refresh]);

  const onChangeDashboard = (value) => {
    const dashboard = dashboardList.find(item => item.id === value);
    if (dashboard) {
      onChange(dashboard);
      window.localStorage.setItem('dashboardUUID', JSON.stringify(value));
    }
  };

  return (
    <Select
      showSearch
      style={{ width: 200 }}
      placeholder="Select a dashboard"
      optionFilterProp="children"
      onChange={onChangeDashboard}
    >
      {dashboardList.map((item, index) => (
        <Option value={item.id}>{item?.name}</Option>
      ))}
    </Select>
  );
};

export default DashboardSelector;