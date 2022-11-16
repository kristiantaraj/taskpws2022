const app = angular.module('pws2022', [ 'ngRoute' ])

app.constant('routes', [
    { route: '/', templateUrl: 'home.html', controller: 'HomeCtrl', controllerAs: 'ctrl' },
    { route: '/persons', templateUrl: 'persons.html', controller: 'PersonsCtrl', controllerAs: 'ctrl' }
])

app.config(['$routeProvider', '$locationProvider', 'routes', function($routeProvider, $locationProvider, routes) {
    $locationProvider.hashPrefix('')
	for(let route of routes) {
		$routeProvider.when(route.route, route)
	}
	$routeProvider.otherwise({ redirectTo: '/' })
}])

app.controller('MainCtrl', [ '$http', function($http) {
    console.log('MainCtrl controller started')
    let ctrl = this

    ctrl.editedRow = -1
    ctrl.persons = []
    ctrl.person = {}

    const clearPerson = {
        firstName: '',
        lastName: '',
        yearOfBirth: 2000
    }

    Object.assign(ctrl.person, clearPerson)

    ctrl.refresh = function() {
        $http.get('/api').then(
            function(res) {
                ctrl.persons = res.data
            },
            function(err) {}
        )
    }

    ctrl.edit = function(index) {
        ctrl.editedRow = index
        ctrl.person.firstName = ctrl.persons[index].firstName
        ctrl.person.lastName = ctrl.persons[index].lastName
        ctrl.person.yearOfBirth = ctrl.persons[index].yearOfBirth
    }

    ctrl.confirm = function(_id) {
        $http.put('/api?_id=' + _id, ctrl.person).then(
            function(res) {
               ctrl.refresh()
            },
            function(err) {}   
        )
        ctrl.editedRow = -1
    }

    ctrl.delete = function(_id) {
        $http.delete('/api?_id=' + _id).then(
            function(res) {
                ctrl.refresh()
            },
            function(err) {}
        )
    }

    ctrl.prepareToAdd = function() {
        Object.assign(ctrl.person, clearPerson)
        ctrl.editedRow=ctrl.persons.length
    } 

    ctrl.add = function() {
        $http.post('/api', ctrl.person).then(
            function(res) {
                ctrl.refresh()
                ctrl.editedRow = -1
                Object.assign(ctrl.person, clearPerson)
            },
            function(err) {}
        )
    }

    ctrl.refresh()
}])

app.controller('HomeCtrl', [ function() {
    console.log('HomeCtrl started')
} ])

app.controller('PersonsCtrl', [ function() {
    console.log('PersonsCtrl started')
} ])