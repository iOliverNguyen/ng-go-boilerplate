angular.module('app.home', [
  'ui.router'
])

.config(function config($locationProvider, $stateProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      views: {
        main: {
          controller: 'HomeCtrl',
          templateUrl: 'home/home.tpl.html'
        }
      },
      data: {}
    });
})

.controller('HomeCtrl', function($scope) {
  $scope.text = 'This is home page';
});
