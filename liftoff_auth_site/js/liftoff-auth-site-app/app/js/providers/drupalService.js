'use strict';

angular.module('drupalService', ['ngResource'])


  .factory('Token', ['$resource', '$rootScope', function ($resource, $rootScope) {
    return $resource($rootScope.apiUrl + 'restws/session/token', null, {
      get: {
        responseType: 'text',
        transformRequest: function(data, headersGetter) {
          headersGetter()['Accept'] = 'application/json';
          console.log('data', data);
        },
      },
    });
  }])


  .factory('Node', ['$resource', '$rootScope', function ($resource, $rootScope) {
    return $resource($rootScope.apiUrl + 'node/:nid', 
      { 'nid': '@nid' },
      {
        get: {
          method:'GET',
          transformRequest: function(data, headersGetter) {
            headersGetter()['Accept'] = 'application/json';
          },
          cache: true
        },
        query: {
          dataType: 'json',
          method:'GET',
          cache: false,
          isArray: false
        },
        save: {
          dataType: 'json',
          method: 'POST',
          headers: { 
            'X-CSRF-Token': $rootScope.token, // @todo: make this work
            'Content-Type': 'application/json'
          }
        }
      }
    );
  }])


  .factory('MenuLink', ['$resource', '$rootScope', function ($resource, $rootScope) {
    return $resource($rootScope.apiUrl + 'menu_link.json', 
      {
        menu_name: $rootScope.menuName,
      },
      {
        query: {
          method:'GET',
          transformRequest: function(data, headersGetter) {
            headersGetter()['Accept'] = 'application/json';
          },
          cache: true,
          isArray: false
        }
      }
    );
  }])


  .factory('View', ['$resource', '$rootScope', function ($resource, $rootScope) {
    return $resource($rootScope.apiUrl + 'rest/:entity/:bundle/:a/:b/:c', 
      {
        entityType: '@entity',
        name: '@bundle',
        a: '@arg0'
      },
      {
        query: {
          method:'GET',
          cache: true,
          isArray: true
        }
      }
    );
  }])

  .factory('TaxonomyTerm', ['$resource', '$rootScope', function ($resource, $rootScope) {
    return $resource($rootScope.apiUrl + 'taxonomy_term/:tid', 
      {
        vocabulary: '@vocabulary',
      },
      {
        get: {
          method:'GET',
          transformRequest: function(data, headersGetter) {
            headersGetter()['Accept'] = 'application/json';
          },
          cache: true,
          isArray: false
        },
        query: {
          method:'GET',
          transformRequest: function(data, headersGetter) {
            headersGetter()['Accept'] = 'application/json';
          },
          cache: true,
          isArray: false
        }
      }
    )
  }])

  .factory('TaxonomyTermIndex', ['$resource', '$rootScope', function ($resource, $rootScope) {
    return $resource($rootScope.apiUrl + 'taxonomy_term?vocabulary&sort=weight&direction=ASC', 
      {
        vocabulary: '@vocabulary',
      },
      {
        query: {
          method:'GET',
          transformRequest: function(data, headersGetter) {
            headersGetter()['Accept'] = 'application/json';
          },
          cache: true,
          isArray: false
        }
      }
    )
  }])

  .factory('TaxonomyTermNodes', ['$resource', '$rootScope', function ($resource, $rootScope) {
    return $resource($rootScope.apiUrl + '/taxonomy_term_nodes', {tid: '@tid'}, {});
  }])

  .factory('User', ['$resource', '$rootScope', function ($resource, $rootScope) {
    return $resource($rootScope.apiUrl + '/user/:uid', {uid: '@uid'}, {});
  }])

  .factory('Comment', ['$resource', '$rootScope', function ($resource, $rootScope) {
      return $resource($rootScope.apiUrl + '/node/:nid/comments', {nid: '@nid'}, {
          'post': {
              method: 'POST',
              url: '/entity/comment'
          }
      });
  }])



  // Helper functions for views
  .factory('viewsFactory', ['View', function(View) {
    var service = {};

    // For infinite scroll pager
    service.pageLoad = function($scope, params) {
      if (!$scope.loadingPage && $scope.items != undefined && $scope.items.length > 0) {
        $scope.currentPage++;
        var newData = View.query(params, function() {
          if (newData.length > 0) {
            Array.prototype.push.apply($scope.items, newData);
            $scope.loadingPage = false;
          }
        });
      }
      $scope.loadingPage = true;
    }

    return service;
  }])
  

  .directive('openReveal', function factory() {
    return {
      restrict: 'A',
      scope: {
        'openReveal': '@'
      },
      link: function($scope, $element, $attrs) {
        // listen for a click
        $element.on('click', function() {
          jQuery('#' + $scope.openReveal).foundation('reveal', 'open');
        });
      }
    }
  });


