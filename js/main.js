// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getDatabase, ref, push, set, onChildAdded, remove, onChildRemoved } 
from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBl8Uylwyi9xSZ9hd8Rcm4nHbZVIbl1tac",
  authDomain: "gsdemo-c115f.firebaseapp.com",
  projectId: "gsdemo-c115f",
  storageBucket: "gsdemo-c115f.appspot.com",
  messagingSenderId: "603573162196",
  appId: "1:603573162196:web:8cec0bb5dc82cf466deb41"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db  = getDatabase(app); //RealtimeDBに接続
const dbRef = ref(db,"chat"); //RealtimeDB内の"chat"を使う

// ユーザ名の取得
let uname = localStorage.getItem("uname");
if(uname == null){
    $("#user").html("名前を決めてください");
}else{
    $("#user").html(uname);
}

//ユーザ名登録モーダルの表示
$("#user").on("click",function(){
    $("#uname").val(uname)
    $("#easyModal").show();
});

//ユーザ名登録モーダルの非表示
$("#modalClose").on("click",function(){
    $("#easyModal").removeAttr("style").hide();
});

$("#uname_button").on("click",function(){
    if($("#uname").val() == ""){
        alert("名前を入力してください");
        return;
    }
    localStorage.setItem("uname", $("#uname").val());
    uname = $("#uname").val();
    $("#user").html(uname);
    $("#easyModal").removeAttr("style").hide();
});

// 送信処理
$("#send").on("click",function(){
    if(uname == null){
        alert("名前を決めてください")
        return
    }
    const ymd = new Date();
    const y = ymd.getFullYear();
    const m = ymd.getMonth()+1;
    const d = ymd.getDate();
    const h = ymd.getHours();
    const min = ymd.getMinutes();
    const msg = {
        uname: uname,
        text:  $("#text").val(),
        date:  y+"/"+m+"/"+d,
        time: h+":"+min
    };
    const newPostRef = push(dbRef); //UniqeIDを発行
    set(newPostRef, msg);           //set(ID名, 値);
    $("#text").val("") //入力欄の初期化
});

// 受信処理
onChildAdded(dbRef, function(data){   
const msg  = data.val();    //オブジェクトデータを取得し、変数msgに代入
const key  = data.key;      //データのユニークキー（削除や更新に使用可能）
//表示用テキスト・HTMLを作成

let chat = '<div class="line_left">';
    chat += '<div class="line_left-text">';
    chat += '<div class="name"><br>';
    chat += msg.uname;
    chat += '</div>';
    chat += '<div class="text">';
    chat += msg.text;
    chat += '</div>';
    chat += '<div class="time">';
    chat +=  msg.date + '</br>' + msg.time;
    chat += '</div>';
    chat += '</div>';
    chat += '</div>';

    $("#chat_main").append(chat); //#outputの最後に追加
    let chatArea = document.getElementById('chat_main'),
    chatAreaHeight = chatArea.scrollHeight;
    chatArea.scrollTop = chatAreaHeight;
});


