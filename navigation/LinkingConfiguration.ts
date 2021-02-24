import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Home: {
            screens: {
              HomeScreen: 'one',
            },
          },
          Search: {
            screens: {
              SearchScreen: 'two',
            },
          },
          Map: {
            screens: {
              MapScreen: 'three',
            },
          },
          Profile: {
            screens: {
              ProfileScreen: 'four',
            },
          },
        },
      },
      NotFound: '*',
    },
  },
};
