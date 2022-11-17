const app = angular.module('pws2022', [ 'ngRoute', 'ngSanitize' ])

app.constant('routes', [
    { route: '/', templateUrl: 'home.html', controller: 'HomeCtrl', controllerAs: 'ctrl', menu: '<i class="fa fa-lg fa-home"></i>' },
    { route: '/example', templateUrl: 'example.html', controller: 'ExampleCtrl', controllerAs: 'ctrl', menu: 'Example' },
    { route: '/persons', templateUrl: 'persons.html', controller: 'PersonsCtrl', controllerAs: 'ctrl', menu: 'Persons' }
])

app.config(['$routeProvider', '$locationProvider', 'routes', function($routeProvider, $locationProvider, routes) {
    $locationProvider.hashPrefix('')
	for(let route of routes) {
		$routeProvider.when(route.route, route)
	}
	$routeProvider.otherwise({ redirectTo: '/' })
}])

app.controller('MainCtrl', [ '$http', '$location', '$scope', 'routes', function($http, $location, $scope, routes) {
    console.log('MainCtrl started')
    let ctrl = this

    ctrl.menu = []

    const rebuildMenu = function() {
        ctrl.menu.length = 0
		for(let route of routes) {
            ctrl.menu.push({ route: route.route, title: route.menu })
		}
        $location.path("/")
    }

    ctrl.isCollapsed = true
    $scope.$on('$routeChangeSuccess', function () {
        ctrl.isCollapsed = true
    })
    
    ctrl.navClass = function(page) {
        return page === $location.path() ? 'active' : ''
    }     

    rebuildMenu()
}])