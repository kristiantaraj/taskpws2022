app.controller('AlltasksCtrl', [ '$http', 'common', function($http, common) {
    console.log('AllTasksCtrl started')
    let ctrl = this

    const endpoint = '/api/tasks'

    ctrl.tasks = []
    ctrl.projects = []
    ctrl.limit = 5
    ctrl.filter = ''


    ctrl.task = {
        name: '',
        project: null,
        creator: '',
        responsible: '',
        done: ''

    }




    ctrl.loadTasks = function() {
        $http.get(endpoint + '?filter=' + ctrl.task.project).then(
            function(res) {
                ctrl.tasks = res.data.records
            },
            function(err) { common.alert('Cannot retrieve tasks', 'danger') }
        )
    }

    ctrl.loadAllTasks = function() {
        $http.get(endpoint).then(
            function(res) {
                ctrl.tasks = res.data.records
            },
            function(err) { common.alert('Cannot retrieve tasks', 'danger') }
        )
    }


    ctrl.refresh = function(withAlert = false) {
        $http.get(endpoint + '?limit=' + ctrl.limit + '&filter=' + ctrl.filter).then(
            function(res) {
                ctrl.tasks = res.data.records
                if(withAlert) {
                    common.alert('View refreshed, ' + ctrl.tasks.length + ' tasks displayed')
                }
            },
            function(err) {
                common.alert('Error: ' + err.data.error, 'danger')
            }
        )
    }



    $http.get('/api/projects').then(
        function(res) {
            ctrl.projects = res.data.records
            ctrl.task.project = ctrl.projects.length > 0 ? ctrl.projects[0]._id : null
            ctrl.loadTasks()
        },
        function(err) { common.alert('Cannot retrieve projects', 'danger') }
    )

}]);