import React, { Component } from "react";
import { Text,Image, View, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { API_ROOT,IMG_PREFIX_URL} from "../config/constant";
import strings from '../config/LanguageStrings'
import AsyncStorage from '@react-native-async-storage/async-storage'

 let deviceWidth = Dimensions.get('window').width

 const imgmen = require("../../assets/images/ic_default_user.png");
 const imgmen1 = require("../../assets/images/ic_delete.png");

class DrawerScreen extends Component {
  _didFocusSubscription
  constructor(props) {
    super(props);
    this.state = {
      user_id: '',
      email:'',
      first_name:'',
      last_name:'',
      followings:0,
      followers:0,
      authtoken:'',
      userphoto:'',
    };
    // this.focusListener = this.props.navigation.addListener('didFocus', () => {
    //     this.realodData()
    //   });
  }

  async componentDidMount() {
    
    await AsyncStorage.getItem('user_id').then((value)=>{
        this.setState({user_id:value})
      });

      await AsyncStorage.getItem('email').then((value)=>{
        this.setState({email:value})
      });

      await AsyncStorage.getItem('first_name').then((value)=>{
        this.setState({first_name:value})
      });

      await AsyncStorage.getItem('last_name').then((value)=>{
        this.setState({last_name:value})
      });

      await AsyncStorage.getItem('profilepic').then((value)=>{
        this.setState({userphoto:value})
      });

  }

  navigate = (screen) => {
    this.props.navigation.navigate(screen)
  }
  __gotoScreen = (screen) => {
  }
  __gotoHautScreen = (content) => {
  }


  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{}}>

          <View style = {{width:'100%', height:220, backgroundColor:'#c80025'}}>
                <View style = {{width:'100%', height:80, backgroundColor:'#c80025',alignItems:'flex-end' }}>
                <TouchableOpacity style = {{width:50, height:50, justifyContent:'center', backgroundColor:'transparent', borderRadius:37}} onPress={()=> {
                  this.props.navigation.toggleDrawer()
                  }}> 
                    <Image source = {imgmen1} resizeMode= 'cover' style={{width:30,height:30,tintColor:'white', borderRadius:37, marginTop:30}}/>
                </TouchableOpacity>
                </View>
                <View style = {{width:'100%', height:140, backgroundColor:'#c80025', flexDirection:'row'}}>
                <TouchableOpacity style = {{width:75, height:75, justifyContent:'center', backgroundColor:'transparent', marginLeft:10,borderRadius:37}} onPress={()=> {
                  this.props.navigation.toggleDrawer()
                  this.navigate('Profile')}}>
                    {this.state.userphoto != '' && this.state.userphoto != null ? <Image source = {{uri:IMG_PREFIX_URL+this.state.userphoto}} resizeMode= 'cover' style={{width:75,height:75,borderRadius:37,}}/> : <Image source = {imgmen} resizeMode= 'cover' style={{width:75,height:75,borderRadius:37, marginTop:30}}/>}
                </TouchableOpacity>
                <View style = {{width:deviceWidth - 120, backgroundColor:'transparent', marginLeft:15}}>
                    <TouchableOpacity style={{marginTop:25}}>
                      <Text style = {{color:'#fff', fontSize:20}}>
                          {this.state.first_name} {this.state.last_name}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginTop:10}}>
                      <Text style = {{width:'100%', color:'#fff', fontSize:13}}>
                          {this.state.email}
                      </Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity onPress={()=>this.navigate('FollowersList')} style={{marginTop:10}}>
                      <Text style = {{width:'100%', color:'#fff', fontSize:12, marginTop:5}}>
                          Followers : {this.state.followers}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.navigate('FollowingsList')} style={{marginTop:10}}>
                      <Text style = {{width:'100%', color:'#fff', fontSize:12, marginTop:5}}>
                          Following : {this.state.followings}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginTop:10}}>
                      <Text style = {{width:'100%', color:'#fff', fontSize:12, marginTop:5}}>
                          Items Listed : 0
                      </Text>
                    </TouchableOpacity> */}
                </View>
                </View>
          </View>

          <View style = {{backgroundColor:'#fff'}}>
                <TouchableOpacity style = {{height:50, width:'100%', backgroundColor:'transparent', justifyContent:'center', marginTop:10}} onPress={()=>{
                  this.props.navigation.toggleDrawer()
                  this.navigate('Home')}}>
                    <Text style = {{width:'100%', color:'#000', fontSize:16, marginLeft:30}}>{strings.Dashboard}</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {{height:50, width:'100%', backgroundColor:'transparent', justifyContent:'center', marginTop:5}} onPress={()=> {
                  this.props.navigation.toggleDrawer()
                  this.navigate('MyJobs')
                  }}>
                    <Text style = {{width:'100%', color:'#000', fontSize:16, marginLeft:30}}>{strings.MyJobs}</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {{height:50, width:'100%', backgroundColor:'transparent', justifyContent:'center', marginTop:5}} onPress={()=>{
                  this.props.navigation.toggleDrawer()
                  this.navigate('ChatList')
                  }}>
                    <Text style = {{width:'100%', color:'#000', fontSize:16, marginLeft:30}}>{strings.Chat}</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {{height:50, width:'100%', backgroundColor:'transparent', justifyContent:'center', marginTop:5}} onPress={()=>{
                  this.props.navigation.toggleDrawer()
                  this.navigate('Profile')
                  }}>
                    <Text style = {{width:'100%', color:'#000', fontSize:16, marginLeft:30}}>{strings.Profile}</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {{height:50, width:'100%', backgroundColor:'transparent', justifyContent:'center', marginTop:5}} onPress={()=>{
                  this.props.navigation.toggleDrawer()
                   this.navigate('Notifications')
                  }}>
                    <Text style = {{width:'100%', color:'#000', fontSize:16, marginLeft:30}}>{strings.Notifications}</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {{height:50, width:'100%', backgroundColor:'transparent', justifyContent:'center', marginTop:5}} onPress = {() => {
                  this.props.navigation.toggleDrawer()
                  this.props.navigation.navigate('Setting',{is_from_profile:false})
                }}>
                    <Text style = {{width:'100%', color:'#000', fontSize:16, marginLeft:30}}>{strings.Settings}</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {{height:50, width:'100%', backgroundColor:'transparent', justifyContent:'center', marginTop:5}} onPress = {() => {
                                        AsyncStorage.setItem('loggedin', '')
                                        AsyncStorage.clear()
                                        this.props.navigation.navigate('Auth')
                                    }}>
                    <Text style = {{width:'100%', color:'#000', fontSize:16, marginLeft:30}}>{strings.Logout}</Text>
                </TouchableOpacity>
          </View>
        </ScrollView>

      </View>
    );
  }
}

export default DrawerScreen;


