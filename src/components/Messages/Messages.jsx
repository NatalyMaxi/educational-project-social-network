import React from 'react';
import classes from './Messages.module.css';
import UserItem from './UserItem/UserItem';
import Dialog from './Dialog/Dialog';
import { Navigate } from 'react-router-dom';

const Messages = (props) => {
   let usrsElements = props.messagesPage.users.map((user) =>
      <UserItem name={user.name} id={user.id} key={user.id} />)

   let messagesElements = props.messagesPage.messages.map((msg) =>
      <Dialog message={msg.message} id={msg.id} key={msg.id} />)

   let onSendMessageClick = () => {
      props.sendMessage()
   }

   let onNewMessageChange = (evt) => {
      let text = evt.target.value;
      props.updateMessageText(text)
   }

   if (!props.isAuth) {
      return <Navigate to='/login'/>
}

   return (
      <div className={classes.messages}>
         <ul className={classes.messages__users}>
            {usrsElements}
         </ul>

         <div className={classes.messages__dialogs}>
            <div>{messagesElements}</div>
            <div>
               <div>
                  <textarea
                     placeholder='Enter your message'
                     value={props.messagesPage.newMessageText}
                     onChange={onNewMessageChange}>
                  </textarea>
               </div>
               <div>
                  <button
                     onClick={onSendMessageClick}
                  >Отправить</button></div>
            </div>
         </div>
      </div>
   );
};

export default Messages;
