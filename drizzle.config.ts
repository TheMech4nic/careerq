import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  out: './drizzle',
  schema: './utils/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://CareerQ_owner:nKDsaiwf9cy5@ep-long-flower-a5i0vzyf.us-east-2.aws.neon.tech/CareerQ?sslmode=require',
  },
});