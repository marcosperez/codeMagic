app.service('sSocket', ['$log', function ($log) {
    var sSocket =  this;

    sSocket.socket = io('http://172.16.22.114:8001');

}])
