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
    $scope.organizations.$loaded(setYs).catch(alert);


    






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
    	org.y = org.portion;
    	$scope.organizations.$save(org);
    }
    $scope.$watch('organizations', function(oldOrganizations, newOrganizations){
    	// currently we're coding "$save()" in everywhere
    	// $scope.organizations.$save();
    	setYs();
    
    }, true); // http://stackoverflow.com/questions/14712089/how-to-deep-watch-an-array-in-angularjs

    // $scope.removeOrg = function(org){
    // 	$scope.organizations.$remove(org); // just org.$remove() doesn't work, because it's the array that has to do the removing, I guess.
    // }

    function alert(msg) {
      $scope.err = msg;
      $timeout(function() {
        $scope.err = null;
      }, 5000);
    }


    function setYs(){
    	for (var i = $scope.organizations.length - 1; i >= 0; i--) {
    		$scope.organizations[i].y = $scope.organizations[i].portion;
    	};
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
	      data: $scope.organizations,
	      id: "giving-data"
	      // ,
	      // animation: {
            // duration: 1000
            // nope; highcharts-ng updates using animation-noncompatible methods... :-(  http://stackoverflow.com/questions/30219869/highcharts-with-angularjs-smooth-transition-of-bars-when-updating-values#comment48611689_30249852
          // }
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