# Interview question readme (Allison Wu)

## Before you try my code

The code requires an AWS environment, kindly create AWS account yourself, the code involve the following futures:

- Please check [`master`](https://github.com/Allison-Wu/aws-test) branch for the questions about uploading file to s3 then trigger the dynamodb saving.

- Please check [`api-gateway`](https://github.com/Allison-Wu/aws-test/tree/api-gateway) branch for using `aws api gateway` as a event trigger to get data from dynamo via `record id`.

## Serverless deployment

NOTE: The test is not including CI/CD environment, but in my past experience, deployment was done by CI/CD tools e.g. Jenkins / Circle CI etc.

``` shell
serverless deploy --aws-profile {aws-profile}
```

`aws-profile` -- please refer to [aws cli](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html) for setting up aws-profile in your development environment.

## Running in development / debug mode

NOTE: before you run the code locally, make sure a `.env` file created properly in `root` folder, for detail environment variables, please check the `.env.example`

``` shell
yarn run-local
```

## Running unit test

NOTE: The tests are mocked and will not call out to any dependencies, and some libraries are commonly shared with my current team, so I copied them with the tests, but they suppose to have unit test before pushing to production.

``` shell
yarn test
```