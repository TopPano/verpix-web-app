# verpix-web-app
Web application for Verpix.

## Getting Started

### Prerequisites

Install dependent npm modules.
```
$ npm install
$ npm install -g pm2
```

Install dependent libraries for running tests.
```
$ sudo apt-get install libfontconfig
```

### Usages
```bash
# Start for development (with auto watching)
$ npm run dev 

# Just build the production version of files
$ npm run build

# Start for production
$ npm run build
$ npm start

# Run unit tests
$ npm test
# or Run unit tests with auto watching
$ npm run test:watch
```
Please read `package.json` to see more usages.
