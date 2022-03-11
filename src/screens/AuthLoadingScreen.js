import React, { Component } from "react";
import {View} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import strings from '../config/LanguageStrings'


class AuthLoadingScreen extends Component {
        constructor (props)
        {
            super(props);
            this.state = {
                    token:'',
            }
        }

       async componentDidMount()
        {
            //alert('hiii')
            
            global.language = strings.getLanguage()
            
            await AsyncStorage.getItem('loggedin').then((value)=>{
                this.props.navigation.navigate((value && value == 'true') ? 'App' : 'Auth')
              });
        }

        render()
        {
            return (
                <View style = {{flex:1}}></View>
            )
        }

}

export default AuthLoadingScreen;