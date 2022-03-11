import React, { Component } from "react";
import { View, TouchableOpacity, Image, Text,Dimensions, FlatList } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import strings from '../config/LanguageStrings'

const icback = require("../../assets/images/ic_back.png");
const redcheck = require("../../assets/images/ic_red_check.png");
const redcircle = require("../../assets/images/red_circle.png");

let deviceWidth = Dimensions.get('window').width


class LanguageSetting extends Component
{
    constructor (props)
    {
        super(props);
        this.state = {
            arrrlanguages: [],
            selectedindex:0,
            showloading:false
        },
        this._didFocusSubscription = props.navigation.addListener('didFocus', payload => {

            this.loadData()
            
            //this.setUpTimer()
       }
       )
    }

    componentDidMount(){  

    }

    loadData()
    {
        var arrLangs = [{'name':strings.English,'value':'en'},{'name':strings.Spanish,'value':'es'},{'name':strings.French,'value':'fr'},{'name':strings.German,'value':'de'},{'name':strings.Portuguese,'value':'pt'},{'name':strings.Russian,'value':'ru'}]

        if(global.language == 'en')
        {
            this.setState({selectedindex:0,arrrlanguages:arrLangs})
        }
        else if(global.language == 'es')
        {
            this.setState({selectedindex:1,arrrlanguages:arrLangs})
        }
        else if(global.language == 'fr')
        {
            this.setState({selectedindex:2,arrrlanguages:arrLangs})
        }
        else if(global.language == 'de')
        {
            this.setState({selectedindex:3,arrrlanguages:arrLangs})
        }
        else if(global.language == 'pt')
        {
            this.setState({selectedindex:4,arrrlanguages:arrLangs})
        }
        else if(global.language == 'ru')
        {
            this.setState({selectedindex:5,arrrlanguages:arrLangs})
        }
    }

    onMenuPressed()
    {
        this.props.navigation.goBack()
    }

    onPressedLanguage(index)
    {
        this.setState({selectedindex:index})
        strings.setLanguage(this.state.arrrlanguages[index].value)
        global.language = this.state.arrrlanguages[index].value
    }

    onPressedSave()
    {
        if(this.state.selected_indexes.length > 0)
        {
            this.updateSkillAPICall()
        }
    }

    renderTopBar()
    {
        return (
            <View style = {{backgroundColor:'#c80025', height:80, width:'100%', flexDirection:'row', justifyContent:'center'}}>
                    <TouchableOpacity style={{position:'absolute',left:15,marginTop:45,height:25,width:25,justifyContent:'center'}} onPress={() => this.onMenuPressed()}>
                        <Image source = {icback} resizeMode= 'contain'/>
                    </TouchableOpacity>
                    <Text style = {{marginTop:45, width:'70%', height:35,textAlign:'center', color:'#fff', fontSize:20, fontWeight:'600'}}>{strings.ChangeLanguage}</Text>
                    {/* <TouchableOpacity style={styles.cartbutton} onPress={() => this.onCartPressed()}>
                        <Image source = {iccart} resizeMode= 'contain'/>
                    </TouchableOpacity> */}
            </View>
        );
    }

    render()
    {
        return(
            <View style = {{flex:1, backgroundColor:'#f0f0f0'}}>
                {this.renderTopBar()}
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        data={this.state.arrrlanguages}
                        ref={(ref) => { this.scroll = ref; }}
                        renderItem={({item, index}) => {

                            return (
                                <View style={{ borderRadius: 5,padding: 5,backgroundColor: 'transparent', alignItems:'center'}}>
                                    <TouchableOpacity style = {{backgroundColor:'#fff', width:deviceWidth - 30,alignItems:'center',borderRadius:10, paddingVertical:10, flexDirection:'row',}} onPress = { () => this.onPressedLanguage(index)}>
                                            <Text style={{fontSize: 10,color: '#515C6F',fontWeight: '500',textAlign:'left',marginBottom:7,marginTop:5,fontSize:15,width:'80%', marginLeft:10}} numberOfLines = {1}>{item.name}</Text>
                                            {
                                                this.state.selectedindex == index ?
                                                <Image source = {redcheck} style = {{height:25, width:25, right:10, position:'absolute',borderColor:'#c80025',borderWidth:2,borderRadius:12.5}} resizeMode='contain'/>
                                                :
                                                <Image source = {redcircle} style = {{height:25, width:25, right:10, position:'absolute'}} resizeMode='contain'/>
                                            }
                                            
                                    </TouchableOpacity>
                                </View>
                                    );        
                                }}
                        keyExtractor={(item, index) => index}
                    />
                    {/* <TouchableOpacity style = {{height:45,borderRadius:22.5,backgroundColor:'#c80025',width:Width(85), alignItems:'center',justifyContent:'center', marginTop:30, alignSelf:'center', marginBottom:30}} onPress = { () => this.onPressedSave()}>
                        <Text style = {{fontSize:20,fontWeight:'500',color:'#fff'}}>Save</Text>
                    </TouchableOpacity> */}
            </View>
        )
    }
}
export default LanguageSetting;