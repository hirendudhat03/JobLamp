import React,{Component} from 'react'
import {AsyncStorage,Dimensions} from 'react-native';
import { createStackNavigator} from 'react-navigation';
import NavigationService from './services/NavigationService';
import Login from './screens/Login';
import ForgotPassword from './screens/ForgotPassword';
import SignUp from './screens/SignUp';
import Welcome from './screens/Welcome';
import Address from './screens/Address';
import Home from './screens/Home';
import Profile from './screens/Profile';
import ProductList from './screens/ProductsList';
import ProductDetails from './screens/ProductDetails';
import CartList from './screens/CartList';
import AddAddress from './screens/AddAddress';
import MyAddresses from './screens/MyAddresses';
import StoreList from './screens/StoreList';
import OrderHistory from './screens/OrderHistory';
import OrderedItems from './screens/OrderedItems';
import PickerHome from './screens/PickerHome';
import PickerCartList from './screens/PickerCartList';
import TimeSlot from './screens/TimeSlot';



// export const DrawerNavigator = createDrawerNavigator(
// 	{
//     OwnerHome:OwnerHomeScreen,
// 	},
// 	{
// 		contentComponent: SlideMenuScreen,
// 		drawerWidth: Dimensions.get('window').width * 0.8,
// 		navigationOptions: {
// 			header: null,
// 		},
// 	}
// );


 const TopLevelNavigator = createStackNavigator(
  {
    Welcome: {
      screen: Welcome,
      navigationOptions: {
        header: null
      }
    },
    Login: {
      screen: Login,
      navigationOptions: {
        header: null
      }
    },
    SignUp: {
      screen: SignUp,
      navigationOptions: {
        header: null
      }
    },
    ForgotPassword: {
      screen: ForgotPassword,
      navigationOptions: {
        header: null
      }
    },
    Address: {
      screen: Address,
      navigationOptions: {
        header: null
      }
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        header: null
      }
    },
    Home: {
      screen: Home,
      navigationOptions: {
        header: null
      }
    },
    ProductList: {
      screen: ProductList,
      navigationOptions: {
        header: null
      }
    },
    ProductDetails: {
      screen: ProductDetails,
      navigationOptions: {
        header: null
      }
    },
    CartList: {
      screen: CartList,
      navigationOptions: {
        header: null
      }
    },
    AddAddress: {
      screen: AddAddress,
      navigationOptions: {
        header: null
      }
    },
    MyAddresses: {
      screen: MyAddresses,
      navigationOptions: {
        header: null
      }
    },
    StoreList: {
      screen: StoreList,
      navigationOptions: {
        header: null
      }
    },
    OrderHistory: {
      screen: OrderHistory,
      navigationOptions: {
        header: null
      }
    },
    OrderedItems: {
      screen: OrderedItems,
      navigationOptions: {
        header: null
      }
    },
    PickerHome: {
      screen: PickerHome,
      navigationOptions: {
        header: null
      }
    },
    PickerCartList: {
      screen: PickerCartList,
      navigationOptions: {
        header: null
      }
    },
    TimeSlot: {
      screen: TimeSlot,
      navigationOptions: {
        header: null
      }
    },
  },
  {
     initialRouteName: "Welcome"//welcome
  }
);

export default TopLevelNavigator;


export const MainNavigator = createStackNavigator(
  {
    Welcome: {
      screen: Welcome,
      navigationOptions: {
        header: null
      }
    },
    Login: {
      screen: Login,
      navigationOptions: {
        header: null
      }
    },
    SignUp: {
      screen: SignUp,
      navigationOptions: {
        header: null
      }
    },
    ForgotPassword: {
      screen: ForgotPassword,
      navigationOptions: {
        header: null
      }
    },
    Address: {
      screen: Address,
      navigationOptions: {
        header: null
      }
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        header: null
      }
    },
    Home: {
      screen: Home,
      navigationOptions: {
        header: null
      }
    },
    ProductList: {
      screen: ProductList,
      navigationOptions: {
        header: null
      }
    },
    ProductDetails: {
      screen: ProductDetails,
      navigationOptions: {
        header: null
      }
    },
    CartList: {
      screen: CartList,
      navigationOptions: {
        header: null
      }
    },
    AddAddress: {
      screen: AddAddress,
      navigationOptions: {
        header: null
      }
    },
    PickerHome: {
      screen: PickerHome,
      navigationOptions: {
        header: null
      }
    },
    PickerCartList: {
      screen: PickerCartList,
      navigationOptions: {
        header: null
      }
    },
    TimeSlot: {
      screen: TimeSlot,
      navigationOptions: {
        header: null
      }
    },
  },
  {
     initialRouteName: "Home"
  }
);

export const createRootNavigator = (signedIn = false) => {
  return createSwitchNavigator(
    {
      SignedIn: {
        screen: TopLevelNavigator
      },
      SignedOut: {
        screen: MainNavigator
      }
    },
    {
      initialRouteName: signedIn ? "SignedIn" : "SignedOut"
    }
  );
};