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

    // auth handling

    ctrl.loggedUser = null
    ctrl.creds = { username: '', password: '' }

    ctrl.doLogin = function() {
        $http.post('/auth', ctrl.creds).then(
            function(res) {
                ctrl.loggedUser = res.data
                rebuildMenu()
            },
            function(err) { console.error('Login failed') }
        )
    }

    ctrl.doLogout = function() {
        $http.delete('/auth').then(
            function(res) {
                ctrl.loggedUser = res.data
                rebuildMenu()
            },
            function(err) { console.error('Logout failed') }
        )
    }

    // menu handling

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

    // whoami - once on the start
    
    $http.get('/auth').then(
        function(res) {
            ctrl.loggedUser = res.data
            rebuildMenu()
        },
        function(err) { console.error('Whoami failed') }
    )    
}])