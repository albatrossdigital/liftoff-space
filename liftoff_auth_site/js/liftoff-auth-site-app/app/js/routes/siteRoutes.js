'use strict';

angular.module('app.site', [
  'ui.router' 
])

.config(
  [ '$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
      
      $urlRouterProvider
        .when('/', '/sites');

      $stateProvider
        
        .state("sites", {
          url: '/sites',
          resolve: {
            nodes: function($stateParams, Node) {
              return Node.query({
                type: 'site',
                sort: 'created',
                order: 'DESC'
              }).$promise.then(function(data) {
                var nodes = data.list;
                angular.forEach(nodes, function(node) {
                  if (node.status != 1) {
                    node.interval = $interval(function() {
                      // @todo: move this into service?
                      $http({
                        url: $rootScope.apiUrl + 'status/38',
                        method: 'GET',
                        cache: false
                      }).success(function(data) {
                        node.icon = 'rocket';
                        $interval.cancel(node.interval);
                      });
                    }, 10000);
                    node.icon = 'rocket fa-spin';
                  }
                  else {
                    if (node.field_platform == 'helm') {
                      node.icon = 'circle-o';
                    }
                    else {
                      node.icon = 'rocket';
                    }
                  }
                });
                return nodes;
              });
            }
          },
          templateUrl: 'views/sites/list.html',
          controller: function($scope, $rootScope, $state, $filter, nodes){
            console.log(nodes);

            $scope.nodes = nodes;

            // Go to site
            $scope.loadSite = function(node) {
              window.location = 'http://'+node.field_machine_name+'.liftoff.albatrossdigital.com'; //node.field_url;
            }

            $scope.loadCreate = function() {
              $state.goto('create');
            }



          }
        })


        .state("create", {
          url: '/create',
          templateUrl: 'views/sites/create.html',
          controller: function($scope, $rootScope, $state, $filter, $http, Node){

            // Get token
            // @todo: move this into service
            if ($rootScope.token == undefined) {
              $http({
                url: $rootScope.apiUrl + 'restws/session/token',
                method: 'GET',
                requestType: 'text',
              }).success(function(data) {
                $rootScope.token = data;
                console.log('dad',data);
              });
            }

            $scope.name = '';
            $scope.machineName = '';
            $scope.machineFocused = false;
            $scope.machineNameClass = '';
            $scope.profile = 'liftoff';

            $scope.getMachineName = function() {
              $scope.machineName = !$scope.machineNameFocused || $scope.machineName == '' ? $scope.name.replace(/[^a-z0-9]/gi, '-').toLowerCase() : $scope.machineName;
              Node.query({
                'type': 'site',
                field_machine_name: $scope.machineName
              }, function(data) {
                if (data.list.length) {
                  $scope.machineNameClass = 'has-error';
                }
                else {
                  $scope.machineNameClass = 'has-success';
                }
              })
            }

            $scope.submit = function(mlid) {
              if ($scope.machineNameClass == 'has-error') {
                alert('Sorry, your machine name is already taken.');
                return;
              }

              
              $scope.activeLink = mlid;
              var data = {
                type: 'site',
                title: $scope.name,
                field_machine_name: $scope.machineName,
                field_profile: $scope.profile
              };
              // Save via $resource
              // @todo: make this work (issues with $rootScope.token not being set in service)
              //var site = new Node(data);
              //site.$save();

              // Save inline
              $http({
                url: $rootScope.apiUrl + 'node',
                dataType: 'json',
                method: 'POST',
                data: data,
                headers: { 
                  'X-CSRF-Token': $rootScope.token,
                  'Content-Type': 'application/json'
                }
              }).success(function(data) {
                $state.go('sites');
              });
            }
          }
        })

    }
  ]
)


