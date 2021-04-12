import React from 'react';
import { View, Alert, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';
import { renderInputToolbar, renderComposer, renderSend } from './InputToolbar';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  
  constructor() {
    super();
    this.state = {
      messages: [],
      user: {
        _id: '',
        name: '',
        avatar: '',
      },
      uid: '',
      isConnected: false,
      image: null,
      location: null,
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

    //checks user's connection
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        console.log('online');

    //reference to load messages via firebase
    this.referenceChatMessages = firebase.firestore().collection('messages');
    this.unsubscribe = this.referenceChatMessages.onSnapshot(this.onCollectionUpdate);

    //authenticates user via firesbase
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      //updates state with current user data
      this.setState({
        isConnected: true,
        user: {
          _id: user.uid,
          name: this.props.route.params.name,
          avatar: 'http://placeimg.com/140/140/any'
        },
        messages: [],
      });
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
      });
    } else {
        console.log("offline");
        Alert.alert('No internet connection, unable to send messages');
        this.setState({
          isConnected: false,
        });
        this.getMessages();
      }
    });

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
            user: {
              _id: data.user._id,
              name: data.user.name,
              avatar: data.user.avatar
            },
            image: data.image || '',
            location: data.location || null
        });
    });
    this.setState({ messages });
  }

  // Adds messages to the current chat log through GiftedChat; state remains unaffected
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
    () => {
      this.addMessage();
      this.saveMessages();
      
    });
  }

  //Adds messages to the firebase.
  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: {
        _id: message.user._id,
        name: message.user.name,
        avatar: message.user.avatar,
      },
      image: message.image || '',
      location: message.location || null
    });
  }

  //gets messages from asyncStorage (native local storage) to display previous messages while offline
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  //adds messages to asyncStorage
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  //deletes messages from asyncStorage
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  //changes text bubble color for users (targeted using 'right'; 'left' would be used to target received messages)
  renderBubble(props) {
    return (
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: '#147EFB'
            },
            left: {
              backgroundColor: '#F0F1EF'
            }
          }}
        />
    )
  }

  //renders action button for adding photos, location etc.
  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  // Returns a MapView that shows user's location
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }
  
  render() {
    //gets name prop from start screen text input and displays name at top of chat
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });
    //defines background color prop user selected on start screen
    let color = this.props.route.params.color;

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff'
      }
    });

    return (
      <View style={{flex: 1, backgroundColor: color }}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={renderInputToolbar}
          renderComposer={renderComposer}
          renderSend={renderSend}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          showUserAvatar
          isTyping
          //renderUsernameOnMessage
          style={{backgroundColor: color }}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          placeholder={'Type a message...'}
          maxInputLength={this.state.isConnected ? 2000 : 0}
          user={{
            _id: this.state.user._id,
            avatar: this.state.user.avatar,
            name: { name } ,
          }}
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    )
  }
}