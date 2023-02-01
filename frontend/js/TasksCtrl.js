app.controller('TasksCtrl', [ '$http', 'common', function($http, common) {
    console.log('TasksCtrl started')
    let ctrl = this

    const endpoint = '/api/tasks'

    ctrl.tasks = []
    ctrl.projects = []


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


    ctrl.updateTaskResponsible = function(_id,p_id) {
        let updatedTask = {responsible: ctrl.loggedUser,project: p_id}
        $http.put(endpoint + '?_id=' + _id, updatedTask).then(
            function(res) {
                ctrl.loadTasks()
            },
            function(err) { common.alert('Cannot update the task', 'danger') }
        )
    }

    ctrl.updateDone = function(_id,p_id) {
        curDate=new Date();
        let updatedTask = {done: curDate,project: p_id}
        $http.put(endpoint + '?_id=' + _id, updatedTask).then(
            function(res) {
                ctrl.loadTasks()
            },
            function(err) { common.alert('Cannot update the task', 'danger') }
        )
    }

    ctrl.addTask = function() {
        $http.post(endpoint, ctrl.task).then(
            function(res) {
                ctrl.loadTasks()
                ctrl.task.name = ''
                ctrl.task.creator = ctrl.loggedUser
            },
            function(err) { common.alert('Cannot add the task', 'danger') }
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


    $http.get('/auth').then(
        function(res) {
            ctrl.loggedUser = res.data
            ctrl.task.creator = ctrl.loggedUser
        },
        function(err) { common.alert('Whoami failed, cannot continue', 'danger') }
    )
}])