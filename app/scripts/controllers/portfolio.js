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

    // todo: implement "organizations" factory: https://www.firebase.com/docs/web/libraries/angular/guide/synchronized-objects.html

    // display any errors
    $scope.organizations.$loaded().catch(alert);

    
    $scope.$watch('organizations', function(oldOrganizations, newOrganizations){
    	$scope.organizations.$save();
    }, true); // http://stackoverflow.com/questions/14712089/how-to-deep-watch-an-array-in-angularjs

    // provide a method for adding a message
    $scope.addOrganization = function() {
        // push an organization to the end of the array
        $scope.organizations.$add({portion:1})
          // display any errors
          .catch(alert);
    }

    $scope.incrementOrgPortion = function(org, delta){
    	org.portion += delta;
    	$scope.organizations.$save(org);
    }

    function alert(msg) {
      $scope.err = msg;
      $timeout(function() {
        $scope.err = null;
      }, 5000);
    }
  });