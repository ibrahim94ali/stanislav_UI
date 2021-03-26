// in the future change graphql policies to support caching properly
export const inMemoryCacheConfig = {
  typePolicies: {
    apartments: {
      keyFields: [],
    },
    myApartments: {
      keyFields: [],
    },
  },
};
