import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Todo } from './Todo';
import registerServiceWorker from './registerServiceWorker';
import 'semantic-ui-css/semantic.min.css';

ReactDOM.render(<Todo />, document.getElementById('root'));
registerServiceWorker();