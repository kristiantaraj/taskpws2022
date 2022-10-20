const app = angular.module('pws2022', [])

app.controller('MainCtrl', [ function() {
    console.log('MainCtrl controller started')
    let ctrl = this

    ctrl.person = {
        firstName: 'John',
        lastName: 'Doe',
        yearOfBirth: 1999
    } 
}])