const app = angular.module('pws2022', [ 'ngRoute', 'ngSanitize', 'ngAnimate', 'ui.bootstrap', 'httpLoadingInterceptor', 'cogAlert' ])

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

app.controller('MainCtrl', [ '$http', '$location', '$scope', 'routes', 'Alerting', function($http, $location, $scope, routes, Alerting) {
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
                Alerting.addSuccess('Welcome, ' + ctrl.loggedUser.username)
            },
            function(err) {
                Alerting.addDanger('Login failed')
            }
        )
    }

    ctrl.doLogout = function() {
        $http.delete('/auth').then(
            function(res) {
                ctrl.loggedUser = res.data
                rebuildMenu()
                Alerting.addSuccess('You are logged out')
            },
            function(err) {}
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
        function(err) { Alerting.addDanger('Whoami failed, cannot continue') }
    )    
}])

app.service('common', [ '$uibModal', function($uibModal) {
    let common = this

    // general modal dialog
    common.dialog = function(template, templateUrl, controller, options, nextTick) {

        let modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            template: template,
            templateUrl: templateUrl,
            controller: controller,
            controllerAs: 'ctrl',
            resolve: { options: function () { return options } }
        })

        modalInstance.result.then(
            function(answer) { nextTick(answer) },
            function() { nextTick(null) }
        )
    }
    
    // confirmation dialog function
    common.simpleDialog = function(title, body, ok, cancel, nextTick) {
        let options = { title, body, ok, cancel }
        common.dialog(`
        <form>

            <div class="modal-header">
                <h3 class="modal-title" id="modal-title" ng-bind="ctrl.options.title"></h3>
            </div>
            <div class="modal-body" id="modal-body" ng-bind-html="ctrl.options.body"></div>
            <div class="modal-footer">
                <button class="btn btn-success fa fa-check" type="button" ng-click="ctrl.dialog.close(true)" ng-if="ctrl.options.ok"></button>
                <button class="btn btn-danger fa fa-times" type="button" ng-click="ctrl.dialog.dismiss()" ng-if="ctrl.options.cancel"></button>
            </div>
    
        </form>        
        `, null, [ '$uibModalInstance', 'options', function($uibModalInstance, options) {
            this.options = options
            this.dialog = $uibModalInstance
        } ], options, nextTick)
    }

}])