const app = angular.module('pws2022', [])

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

    ctrl.confirm = function(index) {
        $http.put('/api?index=' + index, ctrl.person).then(
            function(res) {
               ctrl.persons[index] = res.data
            },
            function(err) {}   
        )
        ctrl.editedRow = -1
    }

    ctrl.delete = function(index) {
        $http.delete('/api?index=' + index).then(
            function(res) {
                ctrl.persons.splice(index, 1)
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
                ctrl.persons.push(res.data)
                ctrl.editedRow = -1
                Object.assign(ctrl.person, clearPerson)
            },
            function(err) {}
        )
    }

    ctrl.refresh()
}])