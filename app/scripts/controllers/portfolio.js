'use strict';

/**
 * @ngdoc function
 * @name angularfireApp.controller:PortfolioCtrl
 * @description
 * # PortfolioCtrl
 * Controller of the angularfireApp
 */
angular.module('angularfireApp'/*, ['highcharts-ng'] NO! https://docs.angularjs.org/guide/module#creation-versus-retrieval ... add the dep in app.js! */)
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
        $scope.organizations.$add({name:1})
          // display any errors
          .catch(alert);
    }

    $scope.incrementOrgPortion = function(org, delta){
    	if (! org.portion) org.portion = 0;
    	org.portion += delta;
    	$scope.organizations.$save(org);
    }

    // $scope.removeOrg = function(org){
    // 	$scope.organizations.$remove(org); // just org.$remove() doesn't work, because it's the array that has to do the removing, I guess.
    // }

    function alert(msg) {
      $scope.err = msg;
      $timeout(function() {
        $scope.err = null;
      }, 5000);
    }






	$scope.chartConfig = {
	  options: {
	    chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
	    },
	    plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
	    },
		tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        }
	  },
	  series: [
	    {
	    	name: "Giving",
	      data: [
			{ _id:123456, name:"WorldVision", y:13 },
			{ _id:123456, name:"WorldVision", y:14 },
			{ _id:123456, name:"WorldVision", y:13 },
			{ _id:123456, name:"WorldVision", y:12 },
			{ _id:123456, name:"WorldVision", y:20 },
			{ _id:123456, name:"WorldVision", y:19 },
			{ _id:123456, name:"WorldVision", y:15 },
			{ _id:123456, name:"WorldVision", y:09 },
			{ _id:123456, name:"WorldVision", y:20 },
			{ _id:123456, name:"WorldVision", y:20 }
	      ],
	      id: "series-5"
	    }
	  ],
	  title: {
	    text: "My Giving Portfolio"
	  },
	  credits: {
	    enabled: false
	  },
	  loading: false,
	  size: {},
	  subtitle: {
	    text: "Giving is Investing - Diversify Your Porfolio!"
	  }
	}
  });