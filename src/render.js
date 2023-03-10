import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import './index.css';
import App from './/components/App/App';
import  { addPost } from './redux/state';

export let rerenderEntireTree = (state) => {
   ReactDOM.render(
      <BrowserRouter>
         <App
            state={state}
            addPost={addPost}
         />
      </BrowserRouter>,
      document.getElementById('root')
   );
}
