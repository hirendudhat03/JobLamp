/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react'
import {Dimensions} from 'react-native'

import {createSwitchNavigator, createAppContainer} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import {createDrawerNavigator} from 'react-navigation-drawer'

import Login from './src/screens/Login'
import SignUpStep1 from './src/screens/SignUpStep1'
import ForgotPass from './src/screens/ForgotPass'
import ResetPassword from './src/screens/ResetPassword'
import DrawerScreen from './src/screens/DrawerScreen'
import AuthLoadingScreen from './src/screens/AuthLoadingScreen'
import TermsConditions from './src/screens/Terms'
import PrivacyPolicy from './src/screens/PrivacyPolicy'
import Home from './src/screens/Home'
import MyJobs from './src/screens/MyJobs'
import Jobs from './src/screens/Jobs'
import PostJob from './src/screens/PostJob'
import JobDetails from './src/screens/JobDetails'
import JobApplications from './src/screens/JobApplications'
import Search from './src/screens/Search'
import Profile from './src/screens/Profile'
import ChangePassword from './src/screens/ChangePassword'
import EditProfile from './src/screens/EditProfile'
import ApplyJob from './src/screens/ApplyJob'
import Notifications from './src/screens/Notifications'
import RateUser from './src/screens/RateUser'
import UserRatings from './src/screens/UserRatings'
import ApplicationDetails from './src/screens/ApplicationDetails'
import ChatList from './src/screens/ChatList'
import CategoryList from './src/screens/CategoryList'
import CategoryJobs from './src/screens/CategoryJobs'
import Chat from './src/screens/Chat'
import UserSkills from './src/screens/UserSkills'
import JobChat from './src/screens/JobChat'
import Payment from './src/screens/Payment'
import TaskworkerPayment from './src/screens/TaskworkerPayment'
import Setting from './src/screens/Setting'
import AboutUs from './src/screens/AboutUs'
import DeliverJob from './src/screens/DeliverJob'
import LanguageSetting from './src/screens/LanguageSetting'
import ContactUs from './src/screens/ContactUs'
import Subscriptions from './src/screens/Subscriptions'
import PortfolioList from './src/screens/PortfolioList'
import AddPortfolio from './src/screens/AddPortfolio'
import OtherUserProfile from './src/screens/OtherUserProfile'
import UserCategories from './src/screens/UserCategories'
import WithdrawalRequest from './src/screens/WithdrawalRequest'
import ViewAllDeliveries from './src/screens/ViewAllDeliveries'

global.device_token = ''
global.language = ''

const AuthStackNavigator = createStackNavigator(
  {
    Login: Login,
    SignUpStep1: SignUpStep1,
    ForgotPass: ForgotPass,
    ResetPassword: ResetPassword,
    PrivacyPolicy: PrivacyPolicy,
    TermsConditions: TermsConditions,
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
)

const AppStackNavigator = createStackNavigator(
  {
    Home: Home,
    Search: Search,
    Jobs: Jobs,
    MyJobs: MyJobs,
    JobApplications: JobApplications,
    JobDetails,
    JobDetails,
    PostJob,
    PostJob,
    DrawerScreen,
    DrawerScreen,
    TermsConditions: TermsConditions,
    PrivacyPolicy: PrivacyPolicy,
    Profile: Profile,
    ChangePassword: ChangePassword,
    EditProfile: EditProfile,
    ApplyJob: ApplyJob,
    Notifications: Notifications,
    RateUser: RateUser,
    UserRatings: UserRatings,
    ApplicationDetails: ApplicationDetails,
    ChatList: ChatList,
    CategoryList: CategoryList,
    CategoryJobs: CategoryJobs,
    Chat: Chat,
    UserSkills: UserSkills,
    JobChat: JobChat,
    Payment: Payment,
    TaskworkerPayment: TaskworkerPayment,
    Setting: Setting,
    AboutUs: AboutUs,
    DeliverJob: DeliverJob,
    ViewAllDeliveries: ViewAllDeliveries,
    LanguageSetting: LanguageSetting,
    ContactUs: ContactUs,
    Subscriptions: Subscriptions,
    PortfolioList: PortfolioList,
    AddPortfolio: AddPortfolio,
    OtherUserProfile: OtherUserProfile,
    UserCategories: UserCategories,
    WithdrawalRequest: WithdrawalRequest,
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
)

const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: AppStackNavigator,
  },
  {
    contentComponent: DrawerScreen,
    drawerWidth: Dimensions.get('window').width * 0.8,
    navigationOptions: {
      header: null,
      drawerLockMode: "locked-close",
      disableGestures: true
    },
  },
)

const AppSwitchNavigator = createSwitchNavigator({
  Authloading: AuthLoadingScreen,
  Auth: AuthStackNavigator,
  App: AppDrawerNavigator,
})

const App = createAppContainer(AppSwitchNavigator)

export default App

// const App: () => React$Node = () => {
//   return (
//     <>
//       <Login/>
//     </>
//   );
// };

// export default App;
