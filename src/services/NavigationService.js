import { NavigationActions,StackActions } from 'react-navigation';
import type { NavigationParams, NavigationRoute } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

function goBack() {
  _navigator.dispatch(
    NavigationActions.back()
  )
}
function reset(routeName: string, params?: NavigationParams) {
  _navigator.dispatch(
    StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          type: 'Navigation/NAVIGATE',
          routeName,
          params,
        }),
      ],
    }),
  );
}
// add other navigation functions that you need and export them

export default {
  navigate,
  setTopLevelNavigator,
  goBack,
  reset
};