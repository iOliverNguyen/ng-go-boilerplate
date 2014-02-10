describe 'AppCtrl', ->

  describe 'Sample', ->

    AppCtrl = $location = $scope = null
    beforeEach module 'app'

    beforeEach inject ($controller, $location, $rootScope) ->
      $scope = $rootScope.$new()
      AppCtrl = $controller 'AppCtrl', { $location: $location, $scope: $scope }

    it 'should pass the sample test', inject ->
      expect(AppCtrl).exist
      a = 1
      expect(a).equal 1
