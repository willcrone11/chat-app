import React from 'react';
import { Image } from 'react-native';
import { InputToolbar, Composer, Send } from 'react-native-gifted-chat';

const renderInputToolbar = (props) => (
  <InputToolbar
    {...props}
    containerStyle={{
      
      
    }}
    primaryStyle={{ alignItems: 'center' }}
  />
);

const renderComposer = (props) => (
  <Composer
    {...props}
    textInputStyle={{
      color: '#000',
      backgroundColor: '#EDF1F7',
      borderWidth: 1,
      borderRadius: 20,
      borderColor: '#E4E9F2',
      paddingTop: 8.5,
      paddingHorizontal: 12,
      marginRight: 10,
    }}
  />
);

const renderSend = (props) => (
  <Send
    {...props}
    disabled={!props.text}
    containerStyle={{
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 4,
    }}
  >
    <Image
      style={{ width: 32, height: 32 }}
      source={require('../assets/send-icon.png')}
      resizeMode={'center'}
    />
  </Send>
);

export {
  renderInputToolbar,
  renderComposer,
  renderSend
};