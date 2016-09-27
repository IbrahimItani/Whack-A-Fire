function loadData() {
    var clientSocket = io();
    clientSocket.emit('loadData');
}