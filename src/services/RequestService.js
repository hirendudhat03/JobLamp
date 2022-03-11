import {store} from './../redux/create';
import {UPDATE_INDICATOR_FLAG,UPDATE_USER_SELECT_OPTION, UPDATE_USER_TYPE} from './../redux/actions/types';
import NavigationService from './NavigationService';
import RNProgressHUB from 'react-native-progresshub';

let DEFAULT_HEADERS = {
   //'Content-Type': 'multipart/form-data',
}
const GET = 'GET'
const HEAD = 'HEAD'

export class RequestService {
  constructor(params) {
    if (!params.url) throw new Error('invalid request url')

    this.params = params
  }

  callIndex=()=> {
    this.params.method = 'GET'
    return this.call()
  }

  callCreate=()=> {
    this.params.method = 'POST'
    return this.call()
  }

  callShow=()=> {
    this.params.method = 'GET'
    return this.call()
  }

  callUpdate=()=> {
    this.params.method = 'PUT'
    return this.call()
  }

  callDestroy=()=> {
    this.params.method = 'DELETE'
    return this.call()
  }

  call=async ()=> {
    if (!this.params.method) return {}
      try{
        RNProgressHUB.showSpinIndeterminate()
        //store.dispatch({type:UPDATE_INDICATOR_FLAG,data:true})
        const asyncResponse = await fetch(this.params.url, this.mountRequest(this.params))
        const json = await asyncResponse.json()
        
        //store.dispatch({type:UPDATE_INDICATOR_FLAG,data:false})
        RNProgressHUB.dismiss()
        if(json.text=='Invalid token key'){
          store.dispatch({type:'Logout'})
          store.dispatch({type:UPDATE_USER_SELECT_OPTION,data:false})
          store.dispatch({type:UPDATE_USER_TYPE,data:'Owner'})

          NavigationService.navigate('UnAuth')
        }
        return json
      }
      catch(e){
        RNProgressHUB.dismiss()
        //store.dispatch({type:UPDATE_INDICATOR_FLAG,data:false})
        return {"success":false,"text":"Something went wrong on server"}
      }
  }

  mountRequest=()=> {
    let request = {
      method: this.params.method,
      headers: this.mountHeaders()
    }
    if (request.method !== GET && request.method !== HEAD) {
      request.body = this.mountBody()
    }
    return request
  }

  mountBody=()=> {
    if (!this.params.body) return {}
    let form_data = new FormData();
    let body = this.params.body

    for ( var key in body) {
        form_data.append(key, body[key]);
    }
   
    for (var file in this.params.files) {
      var photo = {
        uri: this.params.files[file],
        type: 'image/jpg',
        name: file+'.jpg',
      };
      form_data.append(file, photo);
    }
    return form_data
  }

  mountHeaders=()=> {
    let mountedHeaders = Object.assign(
      DEFAULT_HEADERS
    )

    if (this.params.headers) {
      mountedHeaders = Object.assign(
        mountedHeaders,
        this.params.headers
      )
    }

    return mountedHeaders
  }
  mountFiles=()=>{
    let fileArray=[]
    let files = this.params.files
    //alert(JSON.stringify(files))
    if(files){
      for (var file in files) {
        let json={};
        json['filename']=file
        json['filepath']=files[file]
        json['filetype']="image/jpeg"
        fileArray.push(json)
      }
      return fileArray
    }    
    else{
      return fileArray
    }
  }

}
export default RequestService;
