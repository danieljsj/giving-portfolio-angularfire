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
    $scope.organizations.$loaded(initChart).catch(alert); // callback func can still sees the $scope and stuff (why?), but not individual vars declared in here.


    






    // provide a method for adding a message
    $scope.addOrganization = function() {
        // push an organization to the end of the array
        $scope.organizations.$add({
            name:" ",
            portion:0
          })
          // display any errors
          .catch(alert);
    }
    // function alert(msg) { // not sure what the point of scope.err is, but it wasn't doing anything, so I'm making it go back to normal alerts for now.
    //   $scope.err = msg;
    //   $timeout(function() {
    //     $scope.err = null;
    //   }, 5000);
    // }


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
    //  $scope.organizations.$remove(org); // just org.$remove() doesn't work, because it's the array that has to do the removing, I guess.
    // }




    var highchartConfig = {
        // in highcharts-ng, this is nested in an 'options: {...}' object
        chart: {
            renderTo: 'giving-chart',
            // plotBackgroundColor: null,
            // plotBorderWidth: null,
            // plotShadow: false,
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
                },
                center: ["50%","50%"],
                size: "75%"
            }
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        // end of highcharts-ng 'options: {...}' object
        series: [
            {
              name: "Giving",
              data: $scope.organizations,
              id: "giving-data",
              // ,
              // animation: {
                // duration: 1000
                // nope; highcharts-ng updates using animation-noncompatible methods... :-(  http://stackoverflow.com/questions/30219869/highcharts-with-angularjs-smooth-transition-of-bars-when-updating-values#comment48611689_30249852
              // }
              point: {
                    events: {
                        select: function(){
                            console.log(this);
                            for (var i = $scope.organizations.length - 1; i >= 0; i--) {
                                var scopeOrg = $scope.organizations[i];
                                if ( scopeOrg.$id == this.$id){
                                    $scope.selectedOrg = $scope.organizations[i];
                                    $scope.$apply();
                                    break;
                                }
                            };
                            // for (var i = $scope.organizations.length - 1; i >= 0; i--) {
                            //     if ($scope.organizations[i] === this){
                            //         console.log('whoah, exact match!'); // no exact matches. which makes sense; some are points, others are firebase array elements
                            //         break;
                            //     }
                            // };
                        }
                        // unselect: function(){console.log(this)}
                    }
              }
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
    };



    $scope.givingChart = new Highcharts.Chart(highchartConfig);
    console.log($scope.givingChart);

    function initChart(){
        setYs();
        console.log($scope.givingChart);
        $scope.givingChart.series[0].setData($scope.organizations);
    }
    function setYs(){
        for (var i = $scope.organizations.length - 1; i >= 0; i--) {
            $scope.organizations[i].y = $scope.organizations[i].portion;
            console.log($scope.organizations[i]);
        };
        $scope.givingChart.series[0].setData($scope.organizations);
    }


  });