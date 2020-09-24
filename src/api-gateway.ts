import { APIGatewayProxyEvent } from 'aws-lambda';
import { Location } from './models/location';

export const read = async (event: APIGatewayProxyEvent) => {
  try {
    const id = event.pathParameters && event.pathParameters.id;

    if (!id) {
      return {
        statusCode: 400,
        body: 'Location id is empty',
      };
    }

    const locationModel = new Location();
    const locations = await locationModel.query({ id });

    if (!locations.length) {
      return {
        statusCode: 404,
        body: `Location[${id}] not found`,
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(locations),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: error,
    };
  }
};

read({} as any);
