import React from 'react';
import { View, Text, Button, TextInput, StyleSheet, ImageBackground, Image, } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class Start extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      color: '',
      pressStatus1: false,
      pressStatus2: false,
      pressStatus3: false,
      pressStatus4: false,
    };
  }

  render() {
    return (
      <View style={styles.containerOuter}>
        <ImageBackground source={require('../assets/Background-Image.png')} style={styles.imageBackground}>
          <Text style={styles.title}>Chat App</Text>
          <View style={styles.containerInner}>
            <View style={styles.sectionStyle}>
              <Image source={require('../assets/icon.png')} style={styles.imageStyle} />
              <TextInput
                onChangeText={(name) => this.setState({name})}
                value={this.state.name}
                placeholder='Your Name'
              />
            </View>
            <Text style={styles.backgroundColorText}>Choose Background Color:</Text>
            <View style={styles.colors}>
              <TouchableOpacity
                onPress={() => {this.setState({color: '#090C08', pressStatus1: true, pressStatus2: false, pressStatus3: false, pressStatus4: false })}}
                style={this.state.pressStatus1 ? styles.colorPressed1 : styles.color1}
              />
              <TouchableOpacity
                style={styles.color2}
                onPress={() => {this.setState({color: '#474056', pressStatus1: false, pressStatus2: true, pressStatus3: false, pressStatus4: false })}}
                style={this.state.pressStatus2 ? styles.colorPressed2 : styles.color2}
              />
              <TouchableOpacity
                style={styles.color3}
                onPress={() => {this.setState({color: '#8A95A5', pressStatus1: false, pressStatus2: false, pressStatus3: true, pressStatus4: false })}}
                style={this.state.pressStatus3 ? styles.colorPressed3 : styles.color3}
              />
              <TouchableOpacity
                style={styles.color4}
                onPress={() => {this.setState({color: '#B9C6AE', pressStatus1: false, pressStatus2: false, pressStatus3: false, pressStatus4: true})}}
                style={this.state.pressStatus4 ? styles.colorPressed4 : styles.color4}
              />
            </View>
              <TouchableOpacity style={styles.buttonBackground}
                onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, color: this.state.color })}
              >
                <Text style={styles.buttonText}>Start Chatting</Text>
              </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  containerOuter: {
    flex: 1,
  },

  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },

  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  
  containerInner: {
    flexDirection: 'column',
    backgroundColor: 'white',
    margin: 15,
    marginTop: 150,
  },

  backgroundColorText: {
    margin: 15,
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
  },

  imageStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode : 'stretch',
    alignItems: 'center',
  },

  sectionStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    height: 55,
    margin: 15,
    padding: 10,
  },
  
  colors: {
    flexDirection: 'row',
    marginBottom: 10
  },

  color1: {
    backgroundColor: '#090C08',
    width: 40,
    height: 40,
    borderRadius: 40/2,
    margin: 15
  },

  color2: {
    backgroundColor: '#474056',
    width: 40,
    height: 40,
    borderRadius: 40/2,
    margin: 15
  },

  color3: {
    backgroundColor: '#8A95A5',
    width: 40,
    height: 40,
    borderRadius: 40/2,
    margin: 15
  },

  color4: {
    backgroundColor: '#B9C6AE',
    width: 40,
    height: 40,
    borderRadius: 40/2,
    margin: 15
  },

  colorPressed1: {
    backgroundColor: '#090C08',
    width: 40,
    height: 40,
    borderRadius: 40/2,
    margin: 15,
    padding: 10,
    borderWidth: 5,
    borderColor: '#fff',
  },

  colorPressed2: {
    backgroundColor: '#474056',
    width: 40,
    height: 40,
    borderRadius: 40/2,
    margin: 15,
    borderWidth: 5,
    borderColor: '#fff',
  },

  colorPressed3: {
    backgroundColor: '#8A95A5',
    width: 40,
    height: 40,
    borderRadius: 40/2,
    margin: 15,
    borderWidth: 5,
    borderColor: '#fff',
  },

  colorPressed4: {
    backgroundColor: '#B9C6AE',
    width: 40,
    height: 40,
    borderRadius: 40/2,
    margin: 15,
    borderWidth: 5,
    borderColor: '#fff',
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },

  buttonBackground: {
    backgroundColor: '#757083',
    color: '#ffffff',
    margin: 15,
    padding: 15,
  },
});