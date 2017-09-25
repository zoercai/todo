import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Form } from './Form';
import registerServiceWorker from './registerServiceWorker';
import 'semantic-ui-css/semantic.min.css';

ReactDOM.render(<Form />, document.getElementById('root'));
registerServiceWorker();