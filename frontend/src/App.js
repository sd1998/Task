import React, { Component } from 'react';
import axios from 'axios';
import LinkedInSigninDefault from './images/linkedin-signin-default.png';
import configData from './config.js';
import Profile from './Profile.js';
import Snackbar from './Snackbar.js';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      isAuthenticated: false,
      userData: null,
      showSnackBar: false
    };
    this.linkedinBaseURL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${configData.LINKED_IN_CLIENT_ID}&redirect_uri=${configData.LINKED_IN_CALLBACK_URL}&state=98765EeFWf45A53sdfKef4233`;
    this.linkedinSignin = this.linkedinSignin.bind(this);
    this.getParameter = this.getParameter.bind(this);
  }

  getParameter(name, search) {
    const match = RegExp('[?&]' + name + '=([^&]*)').exec(search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  linkedinSignin() {
    const newWindow = window.open(this.linkedinBaseURL, '_blank', true, 500, 500);
    if (window.focus) {
      newWindow.focus();
    }
    const intr = setInterval(() => {
      if (newWindow.closed) {
        clearInterval(intr);
      }
      let search;
      try {
        search = newWindow.location.search;
      } catch (e) {
      }
      if(search) {
        const authCode = this.getParameter('code', search);
        const error = this.getParameter('error', search);
        if(error){
        }
        const DATA_TO_SEND = {
          'grant_type': 'authorization_code',
          'code': authCode,
          'redirect_uri': configData.LINKED_IN_CALLBACK_URL,
          'client_id': "81d8jkcc7csell",
          'client_secret': configData.LINKED_IN_CLIENT_SECRET
        };

        axios.post(configData.LINKED_IN_ACCESS_TOKEN_ROUTE, DATA_TO_SEND).then((accessTokens) => {
            axios.post(configData.LINKED_IN_USER_DETAILS_ROUTE, {'oauth2_access_token' : accessTokens.data})
              .then((success) => {
                var data = success.data;
                if(data.status){
                  this.setState({
                    showSnackBar: true
                  });
                  this.render();
                } else{
                this.setState({
                  isAuthenticated: true,
                  userData: data,
                  showSnackBar: false
                });
              }
              }).catch((errored) => {
              });
          }).catch((errors) => {
          });
        newWindow.close();
      }
    }, 100);
  }

  render(){
    if(this.state.showSnackBar){
      return(
        <div className="App">
        <input type="image" alt="Sign in with LinkedIn" src={LinkedInSigninDefault} className="button" title="Sign in with LinkedIn" onClick={this.linkedinSignin}/>
        <Snackbar/>
        </div>
      );
    } else{
      return(
      <div className="App">
        {
          this.state.isAuthenticated && this.state.userData && !this.state.showSnackBar ?
          (<Profile userData = {this.state.userData}/>) : (
          <input type="image" alt="Sign in with LinkedIn" src={LinkedInSigninDefault} className="button" title="Sign in with LinkedIn" onClick={this.linkedinSignin}/>)
        }
      </div>
    );
    }
  }
}

export default App;
