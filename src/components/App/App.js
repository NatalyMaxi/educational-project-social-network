import React from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { connect, Provider } from 'react-redux';
import { compose } from 'redux';
import './App.css';
import HeaderContainer from '../Header/HeaderContainer';
import Navbar from '../Navbar/Navbar';
import News from '../News/News';
import Music from '../Music/Music';
import Settings from '../Settings/Settings';
import MessageContainer from '../Messages/MessagesContainer';
import UsersContainer from '../Users/UsersContainer';
import ProfileContainer from '../Profile/ProfileContainer';
import Login from '../Login/Login';
import { initializeApp } from '../../redux/app-reducer';
import Preloader from '../Preloader/Preloader';
import { withRouter } from '../hoc/withRouter';
import store from '../../redux/redux-store';
class App extends React.Component {
  componentDidMount() {
    this.props.initializeApp();
  }

  render() {
    if (!this.props.initialized) { return <Preloader /> }

    return (
      <div className='page'>
        <HeaderContainer />
        <Navbar />
        <div className='page__content'>
          <Routes>
            <Route path='/' element={<Navigate to="/profile" />} />
            <Route path='/profile' element={<ProfileContainer />}>
              <Route path=':userId' element={<ProfileContainer />} />
            </Route>
            <Route path='/dialogs/*' element={<MessageContainer />} />
            <Route path='/news' element={<News />} />
            <Route path='/music' element={<Music />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/users' element={<UsersContainer />} />
            <Route path='/login' element={<Login />} />
          </Routes>
        </div>
      </div>);
  }
}

let mapStateToProps = (state) => {
  return {
    initialized: state.app.initialized,
  }
}

const AppContainer = compose(
  withRouter,
  connect(mapStateToProps, { initializeApp })
)(App)

const AppMain = (props) => {
  return <BrowserRouter>
    <Provider store={store}>
      <AppContainer />
    </Provider>
  </BrowserRouter>
}
export default AppMain;