import { createStore, applyMiddleware } from 'redux';
import reducer from './Reducer/Reducer';
import { createLogger } from "redux-logger";
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import reduxPromiseMiddleware from 'redux-promise-middleware';
// import { applyMiddleware, createStore } from 'redux';

const middleware = applyMiddleware(reduxPromiseMiddleware, thunk, logger);
export default createStore(reducer, middleware);


// const logger = createLogger();
// export default createStore(reducer, applyMiddleware(logger,thunk,promiseMiddleware()));

// export default createStore(reducer, applyMiddleware);