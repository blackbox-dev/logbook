import React from 'react';
import { FlatList, ActivityIndicator, Text, View  } from 'react-native';

export default class Logbook extends React.Component {

  constructor(props){
    super(props);
    this.state ={ isLoading: true};
  }

  componentDidMount(){
    fetch('https://localhost:8443/signalk/v1/api/logbook')
      .then(response => response.json())
      .then(data => {
        this.setState({
            isLoading: false,
            dataSource: data,
          });
      })
      .catch((error) =>{
        console.error(error);
      });
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    let la = this.state.dataSource

    var arr = [];
    Object
      .keys(la)
      .forEach(function(key) {
        let elem = JSON.stringify(la[key])
        arr.push([key, elem]);
    });

    return <ul>{arr.map(item => <MyAppChild key={item[0]} label={item[0]} value={item[1]} />)}</ul>;
  }
}

class MyAppChild extends React.Component {
  
  render() {
    let name = ("" + this.props.label).split(".").pop()
    let raw_values = JSON.parse(this.props.value)
    var arr = [];
    Object.keys(raw_values).forEach(function(key) { 
      arr.push([key, raw_values[key]]);
    });

    //return <li>{name + " - " + this.props.value}</li>;

    //let line = <li>{name + " - " + this.props.value}</li>;
    let line = <li>{name}</li>;
    
    let subline = <ul>{arr.map(item => <MyAppChild2 key={item[0]} label={item[0]} value={JSON.stringify(item[1])} />)}</ul>

    return <div>{line}{subline}</div>;
  }
}

class MyAppChild2 extends React.Component {
  
  render() {
    return <li>{this.props.value}</li>;
  }
}