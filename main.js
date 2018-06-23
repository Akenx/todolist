
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var openDB = null;

window.onload=function(){

    openDB = indexedDB.open("object", 1);

    openDB.onupgradeneeded = function (e) {

        var db = openDB.result;
        var object = db.createObjectStore('todolist', {
            keyPath: 'id',
            autoIncrement: true
        });
        object.createIndex('by_task', 'task', {
            unique: false
        });


    };

    openDB.onsuccess = function (e) {
        console.log('Database start');
        showList();
    };

    openDB.onerror = function (e) {
      console.log('Error loading database');
    };

}

function add() {
    var db = openDB.result;
    var data = db.transaction(["todolist"], "readwrite");
    var object = data.objectStore("todolist");

    var request = object.put({
        task: document.querySelector("#task").value,
    });

    data.oncomplete = function (e) {
        document.querySelector('#task').value = '';
        showList();
    };
}




function showList() {

    var db = openDB.result;
    var data = db.transaction(["todolist"], "readonly");
    var object = data.objectStore("todolist");

    var elements = [];

    object.openCursor().onsuccess = function (e) {

        var result = e.target.result;

        if (result === null) {
            return;
        }
        elements.push(result.value);
        result.continue();

    };

    data.oncomplete = function () {

        var output = '';

        for (var key in elements) {
            output += '<div class="block" id="i'+elements[key].id+'" '+'onclick="taskDone('+elements[key].id+')">'
            +elements[key].task +'<button id="bt" onclick="deleteData('+elements[key].id+');">x</button>'+'</div>';
        }

        elements = [];
        document.querySelector("#list").innerHTML = output;

    };

}

function taskDone(id){
    document.getElementById("i"+id).style.color = "#aaa";
    document.getElementById("i"+id).style.textDecoration = "line-through";
}

function deleteData(id) {
  var transaction = openDB.result.transaction(["todolist"], "readwrite");

  var objectStore = transaction.objectStore("todolist");

 objectStore.delete(id);
 window.location.reload();

};

//更新操作没写完
function update(key){
var transaction = openDB.result.transaction(["todolist"], 'readwrite');

    var store = transaction.objectStore("todolist");

    var request = store.get(key);

    request.onsuccess = function(e) {
        var data = e.target.result;
        for (key in elements) {
            data.key = newData.key;
        }
        store.put(data);
    };
}
