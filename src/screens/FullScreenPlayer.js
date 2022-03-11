import React, { Component } from "react";
import { TouchableOpacity, Dimensions,View, Image} from "react-native";
import convertToProxyURL from 'react-native-video-cache';
import VideoPlayer from 'react-native-video-controls';


const close = require("../../assets/images/ic_close.png");

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

class FullScreenPlayer extends Component
{
    constructor (props)
    {
        super(props);
        this.state = {
            videourl:props.navigation.state.params.videourl
        }
    //     this._didFocusSubscription = props.navigation.addListener('didFocus', payload => {
    //         this.loadData()
    //    })
    }

    componentDidMount()
    {
        
    }
    
    onPressedClose()
    {
        this.props.navigation.goBack()
    }

    render()
    {
        return (
            <View style = {{backgroundColor:'red',width:screenWidth,height:screenHeight,alignItems:'center',justifyContent:'center'}}>
                <TouchableOpacity style = {{width:30,height:30,position:'absolute',top:20,right:15,backgroundColor:'#000',borderRadius:15,zIndex:2}} onPress = { () => this.onPressedClose()} activeOpacity = {0.9}>
                        <Image source = {close} resizeMode = 'contain' style = {{width:30,height:30}}></Image>
                </TouchableOpacity>
                <View style = {{backgroundColor:'blue',width:screenHeight,height:screenWidth,transform: [{ rotate: '90deg'}],alignItems:'center',justifyContent:'center'}}>
                    <VideoPlayer source={{uri: convertToProxyURL(this.state.videourl)}} disableBack = {true} disableFullscreen = {true} disableVolume = {true} paused = {true} resizeMode = 'contain' style = {{width:screenHeight}}/>
                </View>
            </View>
        );
    }
}
export default FullScreenPlayer;