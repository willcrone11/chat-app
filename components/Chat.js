import React from 'react';
import { View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  
  constructor() {
    super();
    this.state = {
      messages: [],
      user: '',
      uid: '',
    }

    //initializes firestore
    var firebaseConfig = {
      apiKey: "AIzaSyDibp0m7CyuLs2Za1OLgg_Z96-A-Pr_Vh0",
      authDomain: "chat-app-31787.firebaseapp.com",
      projectId: "chat-app-31787",
      storageBucket: "chat-app-31787.appspot.com",
      messagingSenderId: "1021412781283",
      appId: "1:1021412781283:web:449dadcb53d5df278a29d6",
      measurementId: "G-8DD7KZ01NG"
    };
    
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    
    this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  componentDidMount() {

    this.referenceChatMessages = firebase.firestore().collection('messages');
    this.unsubscribe = this.referenceChatMessages.onSnapshot(this.onCollectionUpdate);

    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      //updates state with current user data
      this.setState({
        uid: user.uid,
        messages: [],
      });
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });

    this.setState({
      user: this.props.route.params.name,
    })

    /* 
    let { name } = this.props.route.params;
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: `${name} has entered the chat`,
          createdAt: new Date(),
          system: true,
        },
      ],
    }) */
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.authUnsubscribe();
 }

 //Updates the messages in the state every time they change on the firestore
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
        //get the QueryDocumentSnapshot's data
        let data = doc.data();
        messages.push({
            _id: data._id,
            text: data.text,
            createdAt: data.createdAt.toDate(),
            user: data.user
        });
    });
    this.setState({
        messages,
    });
  }

  // Adds messages to the current chat log through GiftedChat; state remains unaffected
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
    () => {
      this.addMessage();
    }
  );
    
  }

  //Adds messages to the firebase.
  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
    });
  }

  //changes text bubble color for users (targeted using 'right'; 'left' would be used to target received messages)
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          }
        }}
      />
    )
  }
  
  render() {
    //gets name prop from start screen text input and displays name at top of chat
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });
    //defines background color prop user selected on start screen
    let color  = this.props.route.params.color;

    return (
      <View
        style={{flex: 1, backgroundColor: color }}
      >
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          style={{backgroundColor: color }}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    )
  }
}