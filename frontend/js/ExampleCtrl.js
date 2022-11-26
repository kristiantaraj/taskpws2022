app.controller('ExampleCtrl', [ 'common', 'Alerting', function(common, Alerting) {
    console.log('ExampleCtrl started')
    let ctrl = this

    ctrl.doAction1 = function() {
        Alerting.addWarning('To be implemented')
    }

    ctrl.doAction2 = function() {
        common.simpleDialog('Confirm', 'Please confirm', true, true, function(res) {
            if(res) {
                Alerting.addSuccess('confirmed')
            } else {
                Alerting.addDanger('cancelled')
            }
        })
    }
}])