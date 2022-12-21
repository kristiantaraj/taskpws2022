app.controller('TasksCtrl', [ '$http', 'common', function($http, common) {
    console.log('TasksCtrl started')
    let ctrl = this

    const endpoint = '/api/tasks'

    ctrl.tasks = []
    
    $http.get(endpoint).then(
        function(res) {
            ctrl.tasks = res.data.records
        },
        function(err) { common.alert('Cannot retrieve tasks', 'danger') }
    )
}])