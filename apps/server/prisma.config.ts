import { env, loadEnvFile } from 'node:process';

import { defineConfig } from 'prisma/config';

loadEnvFile(`.env.${env.NODE_ENV || 'development'}`);

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
});
