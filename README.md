# react-online-store

This is online store app, React client, Node Js server.

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the app in the production mode.<br />
NODE_ENV=production<br />
Open [http://localhost:5000](http://localhost:5000) API is available at.

For the React client to work, you need to build the client with the command `npm run client: build`.<br />
The client will be available at (http://localhost:5000/).<br />
You will also see any lint errors in the console.

### `npm run servdev`

Runs the app in the development mode.<br />
NODE_ENV=development<br />
Open [http://localhost:5000](http://localhost:5000) API is available at.

The page will reload if you make edits.<br />
The client will be available at (http://localhost:5000/).<br />
You will also see any lint errors in the console.
To run the React client in development mode, run `npm run clientdev`.<br />
Open [http://localhost:3200](http://localhost:3200/) Client will be available at.

### `npm run clientdev`

Runs the app in the development mode.<br />
Open [http://localhost:3200](http://localhost:3200/) Client will be available at.

### `npm run srvstartcldev`

Running the server and client simultaneously in the development mode.<br />
When you make a change to the code, the server will not be rebuilt. (Servet not nodemon)<br />
Open [http://localhost:3200](http://localhost:3200/) Client will be available at.
Open [http://localhost:5000](http://localhost:5000) API is available at.

### `npm run dev`

Running the server and client simultaneously in the development mode.<br />
When you make a change to the code, the server will be rebuilt. (Servet nodemon)<br />
Open [http://localhost:3200](http://localhost:3200/) Client will be available at.
Open [http://localhost:5000](http://localhost:5000) API is available at.

### `npm run client:build`

Client builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run client:install`

npm install in /client folder.

### `npm run client:update`

npm update in /client folder.

## App Variables

### Server

MONGO_URI_R<br />
JWT_R<br />
PORT_R<br />
API_SERVER_OFF - server return status 503

### Client

REACT_APP_YMAP_KEY - API key Yandex map<br />
REACT_APP_RE_KEY - API key Google recaptcha<br />
REACT_APP_API_URL - API URL<br />
If REACT_APP_API_URL is not set, then in production mode = '', in development mode = 'http://localhost: 5000'.<br />

REACT_APP_NAME - Title in the title tag client static index.html

#### Google Analytics

REACT_APP_GA_ON - On/Off<br />
REACT_APP_GA_KEY - key<br />

#### Yandex metrika

REACT_APP_YM_ON - On/Off<br />
REACT_APP_YM_KEY - key<br />
REACT_APP_YM_WEBVISOR_ON - Webvisor On/Off<br />