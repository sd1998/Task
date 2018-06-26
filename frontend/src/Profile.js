import React,{Component} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import faUsers from '@fortawesome/fontawesome-free-solid/faUsers'
import './App.css';

function ProfileImage(props){
  if(!props.userData.pictureUrl){
    return null;
  } else {
    return (
      <img className="profile-image" src={props.userData.pictureUrl} alt="Profile Picture"/>
    );
  }
}

function Summary(props){
  if(!props.userData.summary){
    return(
      <p className="profile-summary">---</p>
    );
  } else{
    return(
      <p className="profile-summary">{props.userData.summary}</p>
    );
  }
}

export default class Profile extends Component{

  constructor(props){
    super(props);
    this.userData = this.props.userData;
  }

  render(){
    return(
      <div className="profile">
      <ProfileImage userData={this.userData}/>
      <div className="profile-container">
      <h1><a href={this.userData.publicProfileUrl} target="_blank">{this.userData.firstName} {this.userData.lastName}</a></h1>
      <h2> {this.userData.headline} </h2>
      <h3>{this.userData.location.name}・{this.userData.numConnections} <FontAwesomeIcon icon={faUsers}/></h3>
      <hr/>
      <Summary userData={this.userData}/>
      </div>
      </div>
    );
  }

}
