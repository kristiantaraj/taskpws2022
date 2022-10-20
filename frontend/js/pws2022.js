const app = angular.module('pws2022', [])

app.controller('MainCtrl', [ '$http', function($http) {
    console.log('MainCtrl controller started')
    let ctrl = this

    ctrl.persons = []

    ctrl.person = {
        firstName: '',
        lastName: '',
        yearOfBirth: 2000
    } 

    ctrl.refresh = function() {
        $http.get('/api').then(
            function(res) {
                ctrl.persons = res.data
            },
            function(err) {}
        )
    }

    ctrl.refresh()
}])