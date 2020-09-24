import { config } from 'dotenv';
config();

export interface IAwsConfig {
  region?: string;
  profile?: string;
}

export const awsConfig = {
  region: process.env.AWS_REGION,
  profile: process.env.AWS_PROFILE,
};

export const dynamodbConfig = {
  location: process.env.DB_LOCATION || '',
};
