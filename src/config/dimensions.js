import { Dimensions, PixelRatio, Platform, NativeModules } from 'react-native';
const { StatusBarManager } = NativeModules
const X_WIDTH = 375;
const X_HEIGHT = 812;
const { height, width } = Dimensions.get('window')
const Width = widthPercent => {
  const screenWidth = Dimensions.get('window').width;
  // Convert string input to decimal number
  const elemWidth = parseFloat(widthPercent);
  let Pixel = PixelRatio.roundToNearestPixel(screenWidth * elemWidth / 100);
  return parseFloat(Pixel.toFixed(2));
};
const Height = heightPercent => {
  const screenHeight = Dimensions.get('window').height;
  // Convert string input to decimal number
  const elemHeight = parseFloat(heightPercent);
  let Pixel = PixelRatio.roundToNearestPixel(screenHeight * elemHeight / 100);
  return parseFloat(Pixel.toFixed(2));
};
const isIphone = () => {
  return Platform.OS === 'ios'
}
const FontSize = (size) => {
  const screenWidth = Dimensions.get('window').width;
  return parseInt(size) * screenWidth * (1.8 - 0.002 * screenWidth) / 400;
}
const isIphoneX = () => {
  return ((Platform.OS === 'ios') && (height === X_HEIGHT && width === X_WIDTH))
}
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

const StatusBarHeight = () => {
  return Platform.OS === 'android' ? StatusBarManager.HEIGHT : 20
}
const isIphoneXorAbove=()=> {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    ((dimen.height === 812 || dimen.width === 812) || (dimen.height === 896 || dimen.width === 896))
  );
}
const colors = {
  pink:'#FF00BA',
appColor: '#41199B',
white: 'white',
black: 'black',
lightgrey: '#EEEEEE',
lightPink:'#EDE6FC',
black50: 'rgba(0, 0, 0, 0.5)',
dargrey:'#3A4759',
fontDarkGrey:'#8F8F90',
lightBlue:'#4e555f',
blue:'#007AFF'	,
whatFontColor:'#363169'	
};

export {
  Width,
  Height,
  FontSize,
  isIphoneX,
  isIphone,
  ScreenHeight,
  ScreenWidth,
  colors,
  StatusBarHeight,
  isIphoneXorAbove
};