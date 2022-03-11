
import React, { Component } from "react";
import { View, TouchableOpacity, Image, Text, ActivityIndicator, Dimensions, TextInput, Linking, FlatList } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DocumentPicker from 'react-native-document-picker';
import strings from '../config/LanguageStrings';
import Moment from 'moment';

const icback = require("../../assets/images/ic_back.png");
const icattachment = require("../../assets/images/ic_attachment.png");

let deviceWidth = Dimensions.get('window').width
import { Height, Width } from "../config/dimensions";
import { API_ROOT, IMG_PREFIX_URL } from "../config/constant";
import { TouchableHighlight } from "react-native-gesture-handler";

class ViewAllDeliveries extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login_id: '',
            device_token: '',
            job_id: props.navigation.state.params.job_id,
            showloading: false,
            attachment_name: '',
            covertext: '',
            attachment_url: '',
            attachment_type: '',
            view_delivery: props.navigation.state.params.view_delivery,
        }
    }

    async componentDidMount() {

        await AsyncStorage.getItem('user_id').then((value) => {
            this.setState({ login_id: value })
        });

        await AsyncStorage.getItem('device_token').then(value => {
            this.setState({device_token: value})
          })

        if (this.state.view_delivery == true) {
            this.getDeliveryDetailsAPICall()
        }
    }

    onBackPressed() {
        this.props.navigation.goBack()
    }

    async onPressAttachment() {

        console.log('onPressAttachment : ',this.state.attachment_url);

        if (this.state.view_delivery == true) {
            if (this.state.attachment_url != null && this.state.attachment_url != '') {
                let fileurl = IMG_PREFIX_URL + this.state.attachment_url
                //let fileurl = this.state.attachment_url
                Linking.openURL(fileurl)
            }
        }
        else {
            try {
                const res = await DocumentPicker.pick({
                    type: [DocumentPicker.types.zip],
                });
                console.log(
                    res.uri,
                    res.type, // mime type
                    res.name,
                    res.size
                );

                if (res.uri != null && res.uri != '') {
                    this.setState({ attachment_name: res.name, attachment_url: res.uri, attachment_type: res.type })
                }

            } catch (err) {
                if (DocumentPicker.isCancel(err)) {
                    // User cancelled the picker, exit any dialogs or menus and move on
                } else {
                    throw err;
                }
            }
        }
    }

    validateFields() {
        if (this.state.covertext == '') {
            alert(strings.EnterDeliveryDetails)
        }
        else {
            this.deliverJobAPICall()
        }
    }

    deliverJobAPICall() {

        this.setState({ showloading: true })

        var data = new FormData()
        data.append('user_id', this.state.login_id)
        data.append('job_id', this.state.job_id)
        data.append('delivery_text', this.state.covertext)

        if (this.state.attachment_url != null && this.state.attachment_url != '') {
            data.append('delivery_file', {
                name: 'sample.zip',
                type: this.state.attachment_type,
                uri:
                    Platform.OS === "android" ? this.state.attachment_url : this.state.attachment_url.replace("file://", "")
            });
        }

        fetch(API_ROOT + 'submit-job', {
            method: 'post',
            body: data,
            headers: {
              Authorization: 'Bearer ' + this.state.device_token,
            },
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.status == true) {
                    //alert(JSON.stringify(responseData))
                    this.setState({ showloading: false })
                    this.props.navigation.goBack()

                } else {
                    this.setState({ showloading: false })
                    alert(responseData.message)

                }
            })
            .catch((error) => {
                this.setState({ showloading: false })
                alert(error)
            })

    }

    getDeliveryDetailsAPICall() {
        this.setState({ showloading: true })

        var data = new FormData()
        data.append('job_id', this.state.job_id)
        data.append('user_id', 4)
        data.append('offset', 0)
        data.append('limit', 10)

        console.log('PARMS : ', data);
        console.log('URL : ', API_ROOT + 'job-delivery-list');

        fetch(API_ROOT + 'job-delivery-list', {
            method: 'post',
            body: data,
            headers: {
              Authorization: 'Bearer ' + this.state.device_token,
            },
        })
            .then((response) => response.json())
            .then((responseData) => {

                console.log('getDeliveryDetailsAPICall : ', responseData);
                if (responseData.status == true) {
                    //alert(JSON.stringify(responseData))
                    //this.setState({ showloading: false, covertext: responseData.data })
                    console.log('check url : ',responseData.data[0].delivery_file);
                    this.setState({showloading:false,covertext:responseData.data,attachment_name:responseData.data.delivery_file,attachment_url:responseData.data[0].delivery_file})
                } else {
                    this.setState({ showloading: false })
                    //alert(responseData.message)
                }
            })
            .catch((error) => {
                this.setState({ showloading: false })
                alert(error)
            })

    }

    renderTopBar() {
        return (
            <View style={{ backgroundColor: '#c80025', height: 80, width: '100%', flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity style={{ position: 'absolute', left: 15, marginTop: 45, height: 25, width: 25, justifyContent: 'center' }} onPress={() => this.onBackPressed()}>
                    <Image source={icback} resizeMode='contain' />
                </TouchableOpacity>
                {/* <Image source = {toplogo} resizeMode= 'contain' style = {{marginTop:45, width:'70%', height:25}}/> */}
                <Text style={{ marginTop: 45, width: '70%', height: 35, textAlign: 'center', color: '#fff', fontSize: 20, fontWeight: '600' }}>{strings.Deliveries}</Text>
                {/* <TouchableOpacity style={styles.cartbutton} onPress={() => this.onCartPressed()}>
                        <Image source = {iccart} resizeMode= 'contain'/>
                    </TouchableOpacity> */}
            </View>
        );
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#f0f0f0', alignItems: 'center' }}>
                {this.renderTopBar()}

                {
                    this.state.showloading == true ?
                        <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', zIndex: 2, width: Width(100), height: Height(100), position: 'absolute' }}>
                            <ActivityIndicator size="large" color="#3B5998" />
                        </View>
                        : null
                }


                <FlatList
                    data={this.state.covertext}
                    //data defined in constructor
                    style={{ height: '100%', width: "100%", backgroundColor: 'white', borderBottomColor: 'lightgray' }}
                    renderItem={(item) => {
                        console.log('item : ', item.item.delivery_text);
                        return (
                            // FlatList Item
                            <TouchableOpacity style={{ height: 60, borderBottomWidth: 0.7,paddingVertical:7 }} onPress={() => this.props.navigation.navigate('DeliverJob', { job_id: this.state.job_id, view_delivery: true })}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Text
                                            style={{
                                                paddingLeft: 10,
                                                fontSize: 18,
                                                height:25,
                                                color:'#686868',
                                            }}>
                                            Delivery #{item.item.id}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Text
                                            style={{
                                                paddingRight: 10,
                                                fontSize: 12,
                                                textAlign: 'right',
                                                color:'#686868',
                                            }}>
                                            {Moment(item.item.created_at).fromNow()}
                                        </Text>
                                    </View>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', marginTop:10 }}>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Text
                                            style={{
                                                paddingLeft: 10,
                                                fontSize: 14,
                                                color:'#686868',
                                            }}>
                                            {item.item.delivery_text}
                                        </Text>
                                    </View>
                                    <TouchableOpacity style={{ flex: 1, justifyContent: 'flex-end',flexDirection:'row',alignItems:'center' }}
                                    onPress={() => this.onPressAttachment()}
                                    >
                                        
                                        
                                        <Image style = {{width:20,height:20,marginRight:5,tintColor:'red'}} source = {icattachment}></Image>
                                        
                                    
                                        <Text
                                            style={{
                                                paddingRight: 10,
                                                fontSize: 13,
                                                textAlign: 'right',
                                            }}>
                                            Attachment
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                            </TouchableOpacity>

                        );
                    }}
                    keyExtractor={(item, index) => index.toString()}
                />

                {/* <KeyboardAwareScrollView keyboardDismissMode="interactive"
                    keyboardShouldPersistTaps="always"
                    contentContainerStyle={{ alignItems: 'center', flex: 1 }}>



                </KeyboardAwareScrollView> */}

            </View>
        );
    }
}
export default ViewAllDeliveries;