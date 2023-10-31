import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-18fda-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    
    push(shoppingListInDB, {item_name: inputValue})
    
    clearInputFieldEl()
})

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1].item_name
    
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        shoppingListEl.innerHTML = "No items here... yet"
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue.item_name
   
    if (itemValue.strikeout) {
        newEl.setAttribute("class", "strikeout")
    }
    
    newEl.addEventListener("click", function() {
        let  toggleItem = toggle(newEl)
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        update(exactLocationOfItemInDB, {strikeout: toggleItem})
        // remove(exactLocationOfItemInDB)
    })
    
    shoppingListEl.append(newEl)
}

function toggle(el) {
  if (!el.getAttribute("class")) {
      el.setAttribute("class", "strikeout")
      return "strikeout"
  } else {
      el.classList.remove("strikeout");
      return ""
  }
}