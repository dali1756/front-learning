let section = document.querySelector("section");
let add = document.querySelector("form button");
add.addEventListener("click", e => {
    e.preventDefault(); // 測試時先讓輸入內容不要被提交出去

    // get the input value
    let form = e.target.parentElement;
    let todoText = form.children[0].value;
    let todoMonth = form.children[1].value;
    let todoDate = form.children[2].value;

    // 輸入框todoText不得是空白
    if (todoText === "") {
        alert("請輸入待辦事項");
        return; // 這加入return是因為不讓alert完後繼續下列程式碼,否則會一樣出現空白的待辦事項
    }

    // create a todo  創造item
    let todo = document.createElement("div");
    todo.classList.add("todo");
    let text = document.createElement("p");
    text.classList.add("todo-text");
    text.innerText = todoText
    let time = document.createElement("p");
    time.classList.add("todo-time");
    time.innerText = todoMonth + " / " + todoDate;
    // 把text.time append到todo裡
    todo.appendChild(text);
    todo.appendChild(time);

    // create green check and red trash can 新增綠勾和紅垃圾桶
    let completeButton = document.createElement("button");
    completeButton.classList.add("complete");
    completeButton.innerHTML = "<i class = 'fa-regular fa-circle-check'></i>";
    completeButton.addEventListener("click", e => {
        let todoItem = e.target.parentElement;
        todoItem.classList.toggle("done"); // 這利用toggle可反覆點擊變完成or未完成狀態
    })

    let trashButton = document.createElement("button");
    trashButton.classList.add("trash");
    trashButton.innerHTML = "<i class = 'fa-solid fa-trash-can'></i>";

    // 讓新增待辦清單後想移除
    trashButton.addEventListener("click", e => {
        let todoItem = e.target.parentElement;

        todoItem.addEventListener("animationend", () => { // animationend > 動畫結束event,todoItem動畫結束時要做什麼事,執行callback function
            let text = todoItem.children[0].innerText;
            let myListArray = JSON.parse(localStorage.getItem("list"));
            myListArray.forEach((item, index) => {
                if (item.todoText == text) {
                    myListArray.splice(index, 1);
                    localStorage.setItem("list", JSON.stringify(myListArray));
                }
            })
            
            todoItem.remove();
        })
        todoItem.style.animation = "scaleDown 0.4s forwards"; // 新增or移除快慢顯示消失
    })

    // 把completeButton,trashButton append到todo裡
    todo.appendChild(completeButton);
    todo.appendChild(trashButton);
    
    // 設定@keyframes裡動畫效果
    todo.style.animation = "scaleUp 0.4s forwards"; // 新增or移除快慢顯示消失

    // create object 
    let myTodo = {
        todoText: todoText,
        todoMonth: todoMonth,
        todoDate: todoDate
    };

    // 讓待辦事項不會因網頁關閉再開啟而消失,store data into an array of object
    let myList = localStorage.getItem("list"); // 如果在localStorage本來就有list array的話就先parse換成array再加入上方myTodo object然後setItem
    if (myList == null) {
        localStorage.setItem("list", JSON.stringify([myTodo]));
    } else {
        let myListArray = JSON.parse(myList);
        myListArray.push(myTodo);
        localStorage.setItem("list", JSON.stringify(myListArray));
    }
    console.log(JSON.parse(localStorage.getItem("list")));
    

    // 新增待辦事項後清空輸入框中的文字
    form.children[0].value = ""; // clear the text input
    // 最後把todo放入section裡
    section.appendChild(todo);

});

// 網頁關閉重啟時待辦事項不消失
let myList = localStorage.getItem("list");
if (myList !== null) {
    let myListArray = JSON.parse(myList);
    myListArray.forEach(item => { // 下方innerText要從這拿object

        // create todo
        let todo = document.createElement("div");
        todo.classList.add("todo");
        let text = document.createElement("p");
        text.classList.add("todo-text");
        text.innerText = item.todoText; // 這裡的item是myTodo裡的todoText
        let time = document.createElement("p");
        time.classList.add("todo-time");
        time.innerText = item.todoMonth + "/" + item.todoDate;
        todo.appendChild(text);
        todo.appendChild(time);

        let completeButton = document.createElement("button");
        completeButton.classList.add("complete");
        completeButton.innerHTML = "<i class = 'fa-regular fa-circle-check'></i>";
        completeButton.addEventListener("click", e => {
            let todoItem = e.target.parentElement;
            todoItem.classList.toggle("done");
        })
    
        let trashButton = document.createElement("button");
        trashButton.classList.add("trash");
        trashButton.innerHTML = "<i class = 'fa-solid fa-trash-can'></i>";
        trashButton.addEventListener("click", e => {
            let todoItem = e.target.parentElement;
            todoItem.addEventListener("animationend", () => {
                // remove from local storage
                let text = todoItem.children[0].innerText;
                let myListArray = JSON.parse(localStorage.getItem("list"));
                myListArray.forEach((item, index) => {
                    if (item.todoText == text) { // item的屬性是上方,myTodo object裡的todoText
                        myListArray.splice(index, 1);
                        localStorage.setItem("list", JSON.stringify(myListArray));
                    }
                })
                todoItem.remove(); // 如果單純remove只會從html裡移除並不會從local storage移除,所以點擊垃圾桶關閉網頁再重開網頁時會再出現,需加入上方remove from local storage
            })
            todoItem.style.animation = "scaleDown 0.4s forwards"; // 新增or移除快慢顯示消失
        })

        todo.appendChild(completeButton);
        todo.appendChild(trashButton);

        section.appendChild(todo);
    });
}