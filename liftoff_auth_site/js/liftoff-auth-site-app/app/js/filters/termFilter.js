'use strict';

angular.module('siteApp')

.filter('termNoParent', function(item) {
  return item.parent.length == 0;
})
/*
.filter('termParent', function() {
  return function(tid, item) {
    angular.forEach(item.parent, function(value, key) {
      console.log(value.id);
      if (value.id == $scope.activeTid) {
        return true;
      }
    });
    return false;
  };
});
*/