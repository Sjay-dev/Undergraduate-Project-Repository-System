const selectBtn = document.querySelector(".select-btn");
const listItems = document.querySelectorAll(".item");
const btnText = document.querySelector(".btn-text");



// Toggle dropdown open/close
selectBtn.addEventListener("click", () => {
    document.querySelector(".list-items").classList.toggle("show");
    selectBtn.classList.toggle("open"); 
});


// Handle item selection
listItems.forEach(item => {
    item.addEventListener("click", () => {
        item.classList.toggle("checked");

        let checkedItems = document.querySelectorAll(".item.checked");
        if (checkedItems.length > 0) {
            btnText.innerText = `${checkedItems.length} Selected`;
        } else {
            btnText.innerText = "Select LanguageSelect technologies used";
        }
    });
});

// Close dropdown when clicking outside
document.addEventListener("click", (event) => {
    if (!selectBtn.contains(event.target) && !document.querySelector(".list-items").contains(event.target)) {
        document.querySelector(".list-items").classList.remove("show");
        selectBtn.classList.remove("open"); // Remove rotation when closing
    }
});