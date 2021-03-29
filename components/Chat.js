import React from 'react';
import { View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

export default class Chat extends React.Component {
  
  constructor() {
    super();
    this.state = {
      messages: [],
    }
  }

  componentDidMount() {
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
    })
  }

  //the message a user has just sent gets appended to the state 'messages' so that it can be displayed in the chat.
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
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