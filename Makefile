linter:
	./node_modules/.bin/tslint --project .

test:
	./node_modules/.bin/mocha -b -r ts-node/register --exit --colors -t 30000000 --recursive 'src/**/*test.ts'

coverage:
	./node_modules/.bin/nyc npm run test
