angular.module('firebase.config', [])
  .constant('FBURL', 'https://giving-portfolio.firebaseio.com')
  .constant('SIMPLE_LOGIN_PROVIDERS', ['password','facebook','google','twitter'])

  .constant('loginRedirectPath', '/login');
