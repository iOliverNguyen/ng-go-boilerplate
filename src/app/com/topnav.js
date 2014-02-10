angular.module('app.topnav', [])

.directive('topNav', function() {

  function link(scope, element, attrs) {

  }

  return {
    restrict: 'E',
    templateUrl: 'com/topnav.tpl.html',
    link: link,
    scope: true
  };
})

;
