import { InMemoryCacheConfig } from "@apollo/client";

// in the future change graphql policies to support caching properly
export const inMemoryCacheConfig: InMemoryCacheConfig = {
  typePolicies: {
    Query: {
      fields: {
        apartments: {
          keyArgs: [],
          merge(existing, incoming, { args: { offset = 0 } }) {
            // Slicing is necessary because the existing data is
            // immutable, and frozen in development.
            const merged = existing ? existing.slice(0) : [];
            for (let i = 0; i < incoming.length; ++i) {
              merged[offset + i] = incoming[i];
            }
            return merged;
          },
        },
      },
    },
  },
};
