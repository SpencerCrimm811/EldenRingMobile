import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, Button, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import { SelectList } from 'react-native-dropdown-select-list';
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import homeImage from '/Users/spencercrimm/EldenRingApp2/img/vyke.png';
import player1Image from '/Users/spencercrimm/EldenRingApp2/img/godfrey.png';
import player2Image from '/Users/spencercrimm/EldenRingApp2/img/godrick.jpeg';
import versusImage from '/Users/spencercrimm/EldenRingApp2/img/tarnished.jpeg';

const Stack = createNativeStackNavigator();

export default function MyStack() {
  /*
  const [player1, setPlayer1] = React.useState('');
  const [player2, setPlayer2] = React.useState('');

  const pullData1 = (data) => {
    setPlayer1(data)
  };

  const pullData2 = (data) => {
    setPlayer2(data)
  };
  */


  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Player One" component={Player1} />
        <Stack.Screen name="Player Two" component={Player2} />
        <Stack.Screen name="Versus Screen" component={Versus} />
        <Stack.Screen name="Winner Screen" component={Winner} />
      </Stack.Navigator>
    </NavigationContainer>
  )
};

//const homeImage = { uri: 'https://i.imgur.com/NYflxd1.png' };
//const player1Image = { uri: 'https://static.wikia.nocookie.net/eldenring/images/7/7a/ER_Godfrey.png/revision/latest?cb=20220204222224'};
//const player2Image = { uri: 'https://images.wallpapersden.com/image/download/new-elden-ring-gaming_bGxsZW2UmZqaraWkpJRmaWllrWdua2U.jpg'};
//const versusImage = { uri: 'https://wallpapercave.com/wp/wp10864980.jpg' }

function Home({ navigation }) {
  return(
    <View style={homeStyles.container}>
      <ImageBackground source={ homeImage } resizeMode='cover' style={{ flex: 1 }} >
        <Button title='Welcome Tarnished'  onPress={() => navigation.navigate('Player One')}></Button>
      </ImageBackground>
    </View>
  )
};

function Player1({ navigation }) {
  const [selected, setSelected] = React.useState();
  const [key, setKey] = React.useState();
  const [tarnishedArray, setTarnishedArray] = React.useState(initialList1);

  React.useEffect(() => {
    fetch(`http://192.168.1.55:3001/TarnishedDropdown`)
    .then(data => {
      return data.json();
    })
    .then(result => {
      for (let i = 0; i < Object.keys(result).length; i++) {
        setTarnishedArray(oldArray => [...oldArray, result[i]]); /*setTarnishedArray({ tarnishedArray: result})*/
      }
      //console.log(result)
    }).catch(error => {
      console.log(error);
    })
  }, []);


  return (
    <View style={playerStyles.container}>
      <ImageBackground source={ player1Image } resizeMode='cover' style={{ flex: 1 }}>
        <Text style={universalStyles.font}>Who is your Champion Player 1?</Text>
        <StatusBar style="auto" />
        <SelectList inputStyles={{ color: 'gold'}} dropdownTextStyles={{ color: 'gold' }} data={tarnishedArray} setSelected={(val) => setSelected(val)} save="value" />
        <Button title='Submit'  onPress={() => navigation.navigate('Player Two', {
          playerOne: selected,
        })}></Button>
      </ImageBackground>
    </View>
  );
};

function Player2({ route, navigation }) {
  const { playerOne } = route.params;

  const [selected, setSelected] = React.useState();
  const [tarnishedArray, setTarnishedArray] = React.useState(initialList2);

  React.useEffect(() => {
    fetch(`http://192.168.1.55:3001/TarnishedDropdown`)
    .then(data => {
      return data.json();
    })
    .then(result => {
      for (let i = 0; i < Object.keys(result).length; i++) {
        setTarnishedArray(oldArray => [...oldArray, result[i]]); /*setTarnishedArray({ tarnishedArray: result})*/
      }
      //console.log(result)
    }).catch(error => {
      console.log(error);
    })
  }, []);


  return (
    <View style={playerStyles.container}>
      <ImageBackground source={ player2Image } resizeMode='cover' style={{ flex: 1 }}>
        <Text style={universalStyles.font}>Who is your Champion Player 2?</Text>
        <StatusBar style="auto" />
        <SelectList inputStyles={{ color: 'gold'}} dropdownTextStyles={{ color: 'gold' }} data={tarnishedArray} setSelected={(val) => setSelected(val)} save="value" />
        <Button title='Submit'  onPress={() => navigation.navigate('Versus Screen', {
          playerOne: playerOne,
          playerTwo: selected,
        })}></Button>
      </ImageBackground>
    </View>
  );
};

function Versus({ route, navigation }) {

  const { playerOne, playerTwo } = route.params;

  return (
    <View style={versusStyles.container}>
      <ImageBackground source={ versusImage } resizeMode='cover' style={{ flex: 1 }}>
        <Text style={versusStyles.font}>It's { playerOne } versus { playerTwo }!</Text>
        <Button title='Winner' onPress={() => navigation.navigate('Winner Screen', {
          playerOne: playerOne,
          playerTwo: playerTwo,
        })}></Button>
      </ImageBackground>
    </View>
  );
};

function Winner({ route }) {

  const [tarnishedWinner, setTarnishedWinner] = React.useState({});

  const [portraitLink, setPortraitLink] = React.useState({});

  const { playerOne, playerTwo } = route.params;

  const players = [playerOne, playerTwo];

  React.useEffect(() => {
  
      let winner = Math.floor(Math.random() * players.length);
      fetch(`http://192.168.1.55:3000/Tarnished/${players[winner]}`)
      .then(data => {
        return data.json();
      })
      .then(result => {
        //console.log(result);
        //let parsedResult = JSON.parse(result);
        //console.log(parsedResult);
        let updatedJson = {
          ...result,
        };
        //console.log(updatedJson);
        setTarnishedWinner(updatedJson);
        setPortraitLink({ uri: tarnishedWinner.portrait });
        console.log(portraitLink);
        //console.log(tarnishedWinner.json())
      }).catch(error => {
        console.log(error); 
      })
  }, []);

  
  return (
    <View style={versusStyles.container}>
      <ImageBackground source= { homeImage } resizeMode='cover' style={{ flex: 1 }}>
        <Image source= { portraitLink }  style={{ height: 100, width: 100, justifyContent: 'center' }}></Image>
        <Text style ={ universalStyles.font }>{ tarnishedWinner.name } wins! Here is my description: {tarnishedWinner.description}</Text>
      </ImageBackground>
    </View>
  )
};

var initialList1 = [];
var initialList2 = [];

const data = [
  {key:'1', value:'Mobiles'},
  {key:'2', value:'Appliances'},
  {key:'3', value:'Cameras'},
  {key:'4', value:'Computers'},
  {key:'5', value:'Vegetables'},
  {key:'6', value:'Diary Products'},
  {key:'7', value:'Drinks'},
];

const playerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

const versusStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },

  font: {
    color: 'gold',
    fontSize: 44,
    textAlign: 'center',
  },
});

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

const universalStyles = StyleSheet.create({
  font: {
    color: 'gold',
  },
});

