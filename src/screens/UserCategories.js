import React, { Component } from "react";
import { View, TouchableOpacity, Image, Text, ActivityIndicator, Dimensions, FlatList } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Height, Width } from "../config/dimensions";
import { API_ROOT, IMG_PREFIX_URL} from "../config/constant";
import EditProfile from "./EditProfile";
import strings from '../config/LanguageStrings'


const icback = require("../../assets/images/ic_back.png");
const redcheck = require("../../assets/images/ic_red_check.png");
const redcircle = require("../../assets/images/red_circle.png");

let deviceWidth = Dimensions.get('window').width


class UserCategories extends Component
{
    constructor (props)
    {
        super(props);
        this.state = {
            arrcategories:[],
            device_token: '',
            user_categories:props.navigation.state.params.user_categories,
            selected_indexes:[],
            showloading:false,
            plan_id:props.navigation.state.params.plan_id,
        }
    }

    async componentDidMount(){  

        await AsyncStorage.getItem('user_id').then((value)=>{
            this.setState({user_id:value})
          });

          await AsyncStorage.getItem('device_token').then(value => {
            this.setState({device_token: value})
          })

        this.getUserCategoriesAPICall()
    }

    onMenuPressed()
    {
        this.props.navigation.goBack()
    }

    onPressedSkill(index)
    {
        if(this.state.selected_indexes.includes(index))
        {
            var indexcopy = this.state.selected_indexes
            let idx =  indexcopy.indexOf(index)
            indexcopy.splice(idx,1)
            this.setState({selected_indexes:indexcopy})
            //console.log(indexcopy)
        }
        else
        {
            if(this.state.selected_indexes.length >= 3 )
            {
                alert(strings.UpgradePlanForCategories)
            }
            else
            {
                var indexcopy = this.state.selected_indexes
                indexcopy.push(index)
                this.setState({selected_indexes:indexcopy})
            }
            
            //console.log(indexcopy)
        }
    }

    onPressedSave()
    {
        if(this.state.selected_indexes.length > 0)
        {
            this.updateSkillAPICall()
        }
    }

    getUserCategoriesAPICall()
    {
        //alert(JSON.stringify(this.state.user_categories))
    
        this.setState({showloading:true})

        fetch(API_ROOT + 'categorylist', {
            method: 'get',
            headers: {
                Authorization: 'Bearer ' + this.state.device_token,
              },
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.status == true) {
                    //alert(JSON.stringify(responseData))

                    var skills = responseData.data
                    var  indexes = []
                    if(skills != undefined && skills != null)
                    {

                        if(this.state.user_categories != undefined && this.state.user_categories != null)
                        {
                            for (var i = 0; i < skills.length; i++) {
                                var obj = skills[i]
                                if(global.language == 'en')
                                {
                                    
                                    //if(this.state.user_categories.includes(obj.name_en))
                                    if(this.state.user_categories.some(objcat => objcat.name_en === obj.name_en))
                                    {
                                        indexes.push(i)
                                    }
                                }
                                else if(global.language == 'fr')
                                {
                                    if(this.state.user_categories.some(objcat => objcat.name_fr === obj.name_fr))
                                    {
                                        indexes.push(i)
                                    }
                                }
                                else if(global.language == 'es')
                                {
                                    if(this.state.user_categories.some(objcat => objcat.name_es === obj.name_es))
                                    {
                                        indexes.push(i)
                                    }
                                }
                                else if(global.language == 'de')
                                {
                                    if(this.state.user_categories.some(objcat => objcat.name_de === obj.name_de))
                                    {
                                        indexes.push(i)
                                    }   
                                }
                                else if(global.language == 'pt')
                                {
                                    if(this.state.user_categories.some(objcat => objcat.name_pt === obj.name_pt))
                                    {
                                        indexes.push(i)
                                    }
                                }
                                else if(global.language == 'ru')
                                {
                                    if(this.state.user_categories.some(objcat => objcat.name_ru === obj.name_ru))
                                    {
                                        indexes.push(i)
                                    }
                                }
                                
                            }
                        }

                        
                    }
                    //alert(JSON.stringify(responseData.data))
                    this.setState({showloading:false, arrcategories:responseData.data,selected_indexes:indexes})
                    
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

    updateSkillAPICall()
    {

        var arrcategoryids = []

        for (var i = 0; i < this.state.selected_indexes.length; i++) {
            let idx = this.state.selected_indexes[i]
            let objskill = this.state.arrcategories[idx]
            let skillid = objskill.id
            arrcategoryids.push(skillid)
        }

        this.setState({showloading:true})

        var data = new FormData()
        data.append('user_id',this.state.user_id)
        data.append('job_category', JSON.stringify(arrcategoryids))

        fetch(API_ROOT + 'update-job-category', {
            method: 'post',
            body:data,
            headers: {
                Authorization: 'Bearer ' + this.state.device_token,
              },
        })
            .then((response) => response.json())
            .then((responseData) => {
                //alert(JSON.stringify(responseData))
                if (responseData.status == true) {
                    //alert(JSON.stringify(responseData))

                    this.props.navigation.goBack()
                    
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
                {
                    this.state.showloading == true ?
                    <View style = {{alignItems:'center',justifyContent:'center',backgroundColor:'transparent', zIndex:2, width:Width(100), height:Height(100) , position:'absolute'}}>
                        <ActivityIndicator size="large" color="#c80025"/>
                    </View>
                    : null
                }

                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        data={this.state.arrcategories}
                        ref={(ref) => { this.scroll = ref; }}
                        renderItem={({item, index}) => {

                            return (
                                <View style={{ borderRadius: 5,padding: 5,backgroundColor: 'transparent', alignItems:'center'}}>
                                    <TouchableOpacity style = {{backgroundColor:'#fff', width:deviceWidth - 30,alignItems:'center',borderRadius:10, paddingVertical:10, flexDirection:'row',}} onPress = { () => this.onPressedSkill(index)}>
                                            <Text style={{fontSize: 10,color: '#515C6F',fontWeight: '500',textAlign:'left',marginBottom:7,marginTop:5,fontSize:15,width:'80%', marginLeft:10}} numberOfLines = {1}>{item.name_en}</Text>
                                            {
                                                this.state.selected_indexes.includes(index) ?
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
                    <TouchableOpacity style = {{height:45,borderRadius:22.5,backgroundColor:'#c80025',width:Width(85), alignItems:'center',justifyContent:'center', marginTop:30, alignSelf:'center', marginBottom:30}} onPress = { () => this.onPressedSave()}>
                        <Text style = {{fontSize:20,fontWeight:'500',color:'#fff'}}>{strings.Save}</Text>
                    </TouchableOpacity>
            </View>
        )
    }
}
export default UserCategories;