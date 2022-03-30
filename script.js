const listsContainer = document.querySelector('[data-lists]')  //data atribute 'data-lists

let lists = ['name', 'todo']          //variable for list

function render() {     //Method to Render list 
    clearElement(listsContainer)    //clear element with function
    lists.forEach(list => {
        const listElement = document.createElement('li')  // pass element we want 'li'
        listElement.classList.add("list-name")          //add class to 'li'
        listElement.innerText = list                    //set name of actuall element with text inside of it.
        listsContainer.appendChild(listElement)         //append to list container
    })
}

function clearElement(element) {    //Clear function

}


render()