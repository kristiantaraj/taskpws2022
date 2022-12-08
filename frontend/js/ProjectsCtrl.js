app.controller('ProjectsCtrl', [ '$http', 'common', function($http, common) {
    console.log('ProjectsCtrl started')
    let ctrl = this

    const endpoint = '/api/projects'

    ctrl.editedRow = -1
    ctrl.projects = []
    ctrl.project = {}
    ctrl.limit = 5
    ctrl.filter = ''

    const clearProject = {
        name: ''
    }

    Object.assign(ctrl.project, clearProject)

    ctrl.refresh = function(withAlert = false) {
        $http.get(endpoint + '?limit=' + ctrl.limit + '&filter=' + ctrl.filter).then(
            function(res) {
                ctrl.projects = res.data
                if(withAlert) {
                    common.alert('View refreshed, ' + ctrl.projects.length + ' projects displayed')
                }
            },
            function(err) {
                common.alert('Error: ' + err.data.error, 'danger')
            }
        )
    }

    ctrl.edit = function(index) {
        ctrl.editedRow = index
        ctrl.project.name = ctrl.projects[index].name
    }

    ctrl.confirm = function(_id) {
        $http.put(endpoint + '?_id=' + _id, ctrl.project).then(
            function(res) {
                ctrl.refresh()
                common.alert('Project updated')
            },
            function(err) {
                common.alert('Project cannot be updated: ' + err.data.error, 'danger')
            }   
        )
        ctrl.editedRow = -1
    }

    ctrl.delete = function(index) {
        common.simpleDialog('Delete project?', 'Are you sure to delete "' + ctrl.projects[index].name + "'?'",
            true, true, function(res) {
                if(res) {
                    let _id = ctrl.projects[index]._id
                    $http.delete(endpoint + '?_id=' + _id).then(
                        function(res) {
                            common.alert('Project deleted')
                            ctrl.refresh()
                        },
                        function(err) {
                            common.alert('Project cannot be deleted: ' + err.data.error, 'danger')
                        }
                    )          
                }
            })
    }

    ctrl.prepareToAdd = function() {
        Object.assign(ctrl.project, clearProject)
        ctrl.editedRow=ctrl.projects.length
    } 

    ctrl.add = function() {
        $http.post(endpoint, ctrl.project).then(
            function(res) {
                ctrl.refresh()
                ctrl.editedRow = -1
                Object.assign(ctrl.project, clearProject)
                common.alert('Project added')
            },
            function(err) {
                common.alert('Project cannot be added: ' + err.data.error, 'danger')
            }
        )
    }

    ctrl.refresh()
}])