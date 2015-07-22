'use strict';

/**
 * @ngdoc overview
 * @name angularfireApp
 * @description
 * # angularfireApp
 *
 * Main module of the application.
 */
angular.module('angularfireApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase',
    'firebase.ref',
    'firebase.auth',
    // 'highcharts-ng' // highcharts itself maybe isn't a standardized webcomponents module... but then again, note that neither is jQuery listed as a module here... so, that makes sense; i wonder what special powers are conferred/required by being an angular module...
  ]);
