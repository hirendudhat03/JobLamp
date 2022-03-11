import React, { Component } from "react";
import { TouchableOpacity, Text,View, Image} from "react-native";
import WebView from 'react-native-webview'
import strings from '../config/LanguageStrings'

const icback = require("../../assets/images/ic_back.png");
const woman = require("../../assets/images/ic_default_user_black.png");

class Eula extends Component
{
    constructor (props)
    {
        super(props);
        this.state = {
            
        }
    //     this._didFocusSubscription = props.navigation.addListener('didFocus', payload => {
    //         this.loadData()
    //    })
    }

    componentDidMount()
    {
        
    }

    onBackPressed()
    {
        this.props.navigation.goBack()
    }

    renderTopBar()
    {
        return (
            <View style = {{backgroundColor:'#000', height:80, width:'100%', flexDirection:'row', justifyContent:'center'}}>
                    <TouchableOpacity style={{position:'absolute',left:15,marginTop:45,height:25,width:25,justifyContent:'center'}} onPress={() => this.onBackPressed()}>
                        <Image source = {icback} resizeMode= 'contain'/>
                    </TouchableOpacity>
                    <Text style = {{marginTop:45, width:'70%', height:35,textAlign:'center', color:'#fff', fontSize:20, fontWeight:'400'}}>{strings.EULA}</Text>
            </View>
        );
    }


    render()
    {
        return (
            <View style = {{flex:1,backgroundColor:'#fff',alignItems:'center'}}>
                {this.renderTopBar()}
                {/* <View style = {{width:'100%',marginTop:80, marginBottom:30}}>
                    
                </View> */}
                <View style = {{width:'100%',height:'90%',backgroundColor:'red'}}>
                    {/* <WebView source={{ uri:'http://www.mobil-lize.com/public/eula.pdf'}} /> */}
                    <WebView source={{ uri:''}} />
                </View>
                
            </View>
        );
    }

}
export default Eula;