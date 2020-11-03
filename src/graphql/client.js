/* globals window */
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { SchemaLink } from 'apollo-link-schema';
import { makeExecutableSchema } from 'graphql-tools';
import { v4 as uuidv4 } from 'uuid';
const cache = new InMemoryCache();
const defaultDashboardItems = [];

const getDashboardUUID = () =>
  JSON.parse(window.localStorage.getItem('dashboardUUID'));


const getDashboardItems = () => {
  const dashboardList = JSON.parse(window.localStorage.getItem('dashboardList')) ||
    defaultDashboardItems;
  const uuid = getDashboardUUID();

  if (uuid) {
    return dashboardList.find(item => item.id === uuid)?.dashboardItems;
  }
  return [];
}

const getDashboardItems2 = (id) => {
  const dashboardList = JSON.parse(window.localStorage.getItem('dashboardList')) ||
    defaultDashboardItems;
  const uuid = getDashboardUUID();

  if (id) {
    return dashboardList.find(item => item.id === id)?.dashboardItems;
  }
  return [];
}

// const getDashboardItems = () => 
//   JSON.parse(window.localStorage.getItem('dashboardItems')) ||
//   defaultDashboardItems;

// const setDashboardItems = (items) =>
//   window.localStorage.setItem('dashboardItems', JSON.stringify(items));


const setDashboardItems = (items) => {
  const dashboardList = JSON.parse(window.localStorage.getItem('dashboardList')) ||
    defaultDashboardItems;
  const uuid = getDashboardUUID();

  if (uuid) {
    const item = dashboardList.find(item => item.id === uuid);
    item.dashboardItems = items;

    const filtered = dashboardList.filter(item => item.id !== uuid);
    window.localStorage.setItem('dashboardList', JSON.stringify([...filtered, item]));
  }
};

// const nextId = () => {
//   const currentId =
//     parseInt(window.localStorage.getItem('dashboardIdCounter'), 10) || 1;
//   window.localStorage.setItem('dashboardIdCounter', currentId + 1);
//   return currentId.toString();
// };

const toApolloItem = (i) => ({ ...i, __typename: 'DashboardItem' });

const typeDefs = `
  type DashboardItem {
    id: String!
    layout: String
    vizState: String
    name: String
  }

  input DashboardItemInput {
    layout: String
    vizState: String
    name: String
  }

  type Query {
    dashboardItems: [DashboardItem]
    dashboardItem(id: String!): DashboardItem
  }

  type Mutation {
    createDashboardItem(input: DashboardItemInput): DashboardItem
    updateDashboardItem(id: String!, input: DashboardItemInput): DashboardItem
    deleteDashboardItem(id: String!): DashboardItem
    updateDashboard(id: String): [DashboardItem]
  }
`;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    Query: {
      dashboardItems() {
        const dashboardItems = getDashboardItems();
        return dashboardItems.map(toApolloItem);
      },

      dashboardItem(_, { id }) {
        const dashboardItems = getDashboardItems();
        return toApolloItem(dashboardItems.find((i) => i.id.toString() === id));
      },
    },
    Mutation: {
      createDashboardItem: (_, { input: { ...item } }) => {
        const dashboardItems = getDashboardItems();
        item = { ...item, id: uuidv4(), layout: JSON.stringify({}) };
        dashboardItems.push(item);
        setDashboardItems(dashboardItems);
        return toApolloItem(item);
      },
      updateDashboardItem: (_, { id, input: { ...item } }) => {
        const dashboardItems = getDashboardItems();
        item = Object.keys(item)
          .filter((k) => !!item[k])
          .map((k) => ({
            [k]: item[k],
          }))
          .reduce((a, b) => ({ ...a, ...b }), {});
        const index = dashboardItems.findIndex((i) => i.id.toString() === id);
        dashboardItems[index] = { ...dashboardItems[index], ...item };
        setDashboardItems(dashboardItems);
        return toApolloItem(dashboardItems[index]);
      },
      deleteDashboardItem: (_, { id }) => {
        const dashboardItems = getDashboardItems();
        const index = dashboardItems.findIndex((i) => i.id.toString() === id);
        const [removedItem] = dashboardItems.splice(index, 1);
        setDashboardItems(dashboardItems);
        return toApolloItem(removedItem);
      },
      updateDashboard: (_, { id }) => {
        const dashboardItems = getDashboardItems2(id);
        return dashboardItems.map(toApolloItem);
      },
    },
  },
});

export default new ApolloClient({
  cache,
  link: new SchemaLink({
    schema,
  }),
});
