
import React, { Component } from "react";
import { View, TouchableOpacity,Image, Text, FlatList, Dimensions,ActivityIndicator } from "react-native";
import Moment from 'moment'
import AsyncStorage from '@react-native-async-storage/async-storage'
import strings from '../config/LanguageStrings'

import { API_ROOT, IMG_PREFIX_URL} from "../config/constant";
import { Height, Width } from "../config/dimensions";

const icback = require("../../assets/images/ic_back.png");


let deviceWidth = Dimensions.get('window').width

class CategoryList extends Component
{
    constructor (props)
    {
        super(props);
        this.state = {
            device_token: '',
            arrcategories:props.navigation.state.params.arrcategories,
            showloading:false
        }
    }

    async componentDidMount()
    {

        await AsyncStorage.getItem('device_token').then(value => {
            this.setState({device_token: value})
          })
        this.getCategoriesAPICall()
    }
    
    onMenuPressed()
    {
        this.props.navigation.goBack()
    }

    onPressedCategory(item)
    {
        this.props.navigation.navigate('CategoryJobs',{category_id:item.category_id})
    }

    getCategoriesAPICall()
    {
        this.setState({showloading:true})

        fetch(API_ROOT + 'categorylist', {
            method: 'get',
            headers: {
                Authorization: 'Bearer ' + this.state.device_token,
              },
        })
            .then((response) => response.json())
            .then((responseData) => {
                //alert(JSON.stringify(responseData))
                if (responseData.status == true) {
                    this.setState({arrcategories:responseData.data,showloading:false})
                } else {
                    this.setState({showloading:false})
                    //alert(responseData.message)
                }
            })
            .catch((error) => {
                this.setState({showloading:false})
                //alert(error)
            })
    }

    renderTopBar()
    {
        return (
            <View style = {{backgroundColor:'#c80025', height:80, width:'100%', flexDirection:'row', justifyContent:'center'}}>
                    <TouchableOpacity style={{position:'absolute',left:15,marginTop:45,height:25,width:25,justifyContent:'center'}} onPress={() => this.onMenuPressed()}>
                        <Image source = {icback} resizeMode= 'contain'/>
                    </TouchableOpacity>
                    <Text style = {{marginTop:45, width:'70%', height:35,textAlign:'center', color:'#fff', fontSize:20, fontWeight:'600'}}>{strings.Categories}</Text>
            </View>
        );
    }

    render(){
        return(
            <View style = {{flex:1,backgroundColor:'#f0f0f0'}}>
                {this.renderTopBar()}
                {
                    this.state.showloading == true ?
                    <View style = {{alignItems:'center',justifyContent:'center',backgroundColor:'transparent', zIndex:2, width:Width(100), height:Height(100) , position:'absolute'}}>
                        <ActivityIndicator size="large" color="#c80025"/>
                    </View>
                    : null
                }
                <View style = {{width:'100%',flex:1}}>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        data={this.state.arrcategories}
                        ref={(ref) => { this.scroll = ref; }}
                        renderItem={({ item,index }) => {
                            return (
                                    <TouchableOpacity style={{ borderRadius: 5,padding: 5,backgroundColor: 'transparent', alignItems:'center'}} activeOpacity = {0.9} onPress = { () => this.onPressedCategory(item)}>
                                        <View style = {{backgroundColor:'#fff', width:deviceWidth - 30,borderRadius:10, paddingVertical:10, flexDirection:'row'}}>
                                            <View style = {{width:'90%', marginLeft:10, alignItems:'center',flexDirection:'row'}}>
                                                {
                                                    global.language == 'en' ?
                                                        <Text style={{fontSize: 10,color: '#6e6e6e',fontWeight: '400',textAlign:'left',marginBottom:7,marginTop:7,fontSize:15}} numberOfLines = {1}>{item.name_en}</Text>
                                                    :
                                                    global.language == 'es' ?
                                                        <Text style={{fontSize: 10,color: '#6e6e6e',fontWeight: '400',textAlign:'left',marginBottom:7,marginTop:7,fontSize:15}} numberOfLines = {1}>{item.name_es}</Text>
                                                    :
                                                    global.language == 'fr' ?
                                                        <Text style={{fontSize: 10,color: '#6e6e6e',fontWeight: '400',textAlign:'left',marginBottom:7,marginTop:7,fontSize:15}} numberOfLines = {1}>{item.name_fr}</Text>
                                                    :
                                                    global.language == 'de' ?
                                                        <Text style={{fontSize: 10,color: '#6e6e6e',fontWeight: '400',textAlign:'left',marginBottom:7,marginTop:7,fontSize:15}} numberOfLines = {1}>{item.name_de}</Text>
                                                    :
                                                    global.language == 'pt' ?
                                                        <Text style={{fontSize: 10,color: '#6e6e6e',fontWeight: '400',textAlign:'left',marginBottom:7,marginTop:7,fontSize:15}} numberOfLines = {1}>{item.name_pt}</Text>
                                                    :
                                                    global.language == 'ru' ?
                                                        <Text style={{fontSize: 10,color: '#6e6e6e',fontWeight: '400',textAlign:'left',marginBottom:7,marginTop:7,fontSize:15}} numberOfLines = {1}>{item.name_ru}</Text>
                                                    :
                                                    null
                                                }
                                                
                                                <Text style = {{fontSize:12,fontWeight:'500',color:'#c80025',textAlign:'right',marginLeft:5}} numberOfLines = {1}>({item.total_job})</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    );        
                                }}
                        keyExtractor={(item, index) => index}
                    />
                </View>
            </View>
        )
    }

}
export default CategoryList;