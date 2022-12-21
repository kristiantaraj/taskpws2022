app.controller('TasksCtrl', [ '$http', 'common', function($http, common) {
    console.log('TasksCtrl started')
    let ctrl = this

    const endpoint = '/api/tasks'

    ctrl.tasks = []
    ctrl.projects = []
    ctrl.selectedProjectId = null

    ctrl.test = function() {
        console.log(ctrl.selectedProjectId)
    }

    $http.get(endpoint).then(
        function(res) {
            ctrl.tasks = res.data.records
        },
        function(err) { common.alert('Cannot retrieve tasks', 'danger') }
    )

    $http.get('/api/projects').then(
        function(res) {
            ctrl.projects = res.data.records
        },
        function(err) { common.alert('Cannot retrieve projects', 'danger') }
    )
}])