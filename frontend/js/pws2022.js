const app = angular.module('pws2022', [])

app.controller('MainCtrl', [ '$http', function($http) {
    console.log('MainCtrl controller started')
    let ctrl = this

    ctrl.editedRow = -1
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

    ctrl.edit = function(index) {
        ctrl.editedRow = index
        ctrl.person.firstName = ctrl.persons[index].firstName
        ctrl.person.lastName = ctrl.persons[index].lastName
        ctrl.person.yearOfBirth = ctrl.persons[index].yearOfBirth
    }

    ctrl.confirm = function(index) {
        $http.put('/api?index=' + index, ctrl.person).then(
            function(res) {
                /*
                ctrl.persons[index].firstName = ctrl.person.firstName
                ctrl.persons[index].lastName = ctrl.person.lastName
                ctrl.persons[index].yearOfBirth = ctrl.person.yearOfBirth
                */

               /*
               ctrl.persons = res.data
               */

               /*
               ctrl.persons[index] = res.data[index]
               */

               ctrl.persons[index] = res.data
            },
            function(err) {}   
        )
        ctrl.editedRow = -1
    }

    ctrl.refresh()
}])