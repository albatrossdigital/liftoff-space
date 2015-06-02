'use strict';

angular.module('app.static', [
  'ui.router',
])

.config(
  [ '$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
      
      $urlRouterProvider
        .when('', 'answers');

      $stateProvider
        
        /*.state("status", {
          url: '/status',
          templateUrl: 'views/static/static-status.html',
          controller: function($scope, $rootScope, $state){
          }
        })*/


    }
  ]
);
