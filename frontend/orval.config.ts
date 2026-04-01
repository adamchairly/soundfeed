import { defineConfig } from 'orval';

export default defineConfig({
  soundfeed: {
    input: {
      target: './swagger.json',
    },
    output: {
      mode: 'single',
      target: './src/api/generated/index.ts',
      schemas: './src/api/generated/model',
      client: 'react-query',
      httpClient: 'axios',
      override: {
        mutator: {
          path: './src/api/mutator/custom-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
