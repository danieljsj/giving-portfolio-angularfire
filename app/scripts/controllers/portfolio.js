'use strict';

/**
 * @ngdoc function
 * @name angularfireApp.controller:PortfolioCtrl
 * @description
 * # PortfolioCtrl
 * Controller of the angularfireApp
 */
angular.module('angularfireApp')
  .controller('PortfolioCtrl', function ($scope, Ref, $firebaseArray, $timeout) {
    // synchronize a read-only, synchronized array of organizations, limit to most recent 10
    $scope.organizations = $firebaseArray(Ref.child('organizations').limitToLast(10));

    // display any errors
    $scope.organizations.$loaded().catch(alert);

    // provide a method for adding a message
    $scope.addOrganization = function() {
        // push an organization to the end of the array
        $scope.organizations.$add({portion:1})
          // display any errors
          .catch(alert);
    }

    function alert(msg) {
      $scope.err = msg;
      $timeout(function() {
        $scope.err = null;
      }, 5000);
    }
  });