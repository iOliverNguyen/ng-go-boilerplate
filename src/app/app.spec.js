describe('App', function() {
  describe('Dummy', function() {
    var AppCtrl, $location, $scope;

    beforeEach(module('app'));

    beforeEach(inject(function($controller, _$location_, $rootScope) {
      $location = _$location_;
      $scope = $rootScope.$new();
      AppCtrl = $controller('AppCtrl', {
        $location: $location,
        $scope: $scope
      });
    }));

    it('should pass a dummy test', inject(function() {
      expect(AppCtrl).an('object');
    }));
  });
});
