const listsContainer = document.querySelector('[data-lists]');
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListButton = document.querySelector('[data-delete-list-button]')
const listDisplatContainer = document.querySelector('[data-list-display-container]')
const listTitleElement = document.querySelector('[data-list-title]')
const listCountElement = document.querySelector('[data-list-count]')
const tasksConstainer = document.querySelector('[data-tasks]')
const taskTemplate = document.getElementById('task-template')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')
const clearCompleteTaskButton = document.querySelector('[data-clear-complete-task-button]')

const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []  
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)  

listsContainer.addEventListener('click', e => {     //when click inside of listsContainer 
    if (e.target.tagName.toLowerCase() === 'li') {  //and target is 'li' 
        selectedListId = e.target.dataset.listId    //then selected ListID if list.id 
        saveAndRender()
    }
})

tasksConstainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input') { 
        const selectedList =lists.find(list => list.id === selectedListId)    //then selected ListID if list.id 
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
        selectedTask.complete = e.target.checked
        save()
        renderTaskCount(selectedList)
    }
})

clearCompleteTaskButton.addEventListener('click', e => {
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
    saveAndRender()
})

deleteListButton.addEventListener('click', e => {
    lists = lists.filter(list => list.id !== selectedListId)    //list will equal new list that is not selected.
    selectedListId = null               //unselect list 
    saveAndRender()
})

newListForm.addEventListener('submit' , e => {
    e.preventDefault()
    const listName = newListInput.value
    if(listName == null || listName === '') return
    const list = createList(listName)   //create new list if value is entered.
    newListInput.value = null           //clear input for next input
    lists.push(list)                    //push list to lists array
    saveAndRender()
})

newTaskForm.addEventListener('submit' , e => {
    e.preventDefault()
    const taskName = newTaskInput.value
    if(taskName == null || taskName === '') return
    const task = createTask(taskName)   //
    newTaskInput.value = null           //
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.push(task)                    //
    saveAndRender()
})

function createList(name) {
    return {id: Date.now().toString(), name: name, tasks: [] }     //object, unique id identifier(time used application),tasks
}

function createTask(name) {
    return {id: Date.now().toString(), name: name, complete: false}
}



function saveAndRender() {
    save()
    render()
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}
function render() {
    clearElement(listsContainer)
    renderLists()

    const selectedList = lists.find(list => list.id === selectedListId) //Find selected list by id     
    if (selectedListId == null) {
        listDisplatContainer.style.display = 'none'
    }   else {
        listDisplatContainer.style.display= ''
        listTitleElement.innerText = selectedList.name    //get title through selected list name
        renderTaskCount(selectedList)
        clearElement(tasksConstainer)
        renderTasks(selectedList)
    }
    
}

function renderTasks(selectedList) {
    selectedList.tasks.forEach(task => {                    //look through each list task
        const taskElement = document.importNode(taskTemplate.content, true)
        const checkbox = taskElement.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.complete
        const label = taskElement.querySelector('label')
        label.htmlFor = task.id
        label.append(task.name)
        tasksConstainer.appendChild(taskElement)
    }) 

}

function renderTaskCount(selectedList) {
    const incompleteTasksCount = selectedList.tasks.filter(tasks => !tasks.complete).length
    const taskString = incompleteTasksCount == 1 ? "task" : "tasks" //compact if else. What happens between ? : if True
    listCountElement.innerText = `${incompleteTasksCount} ${taskString} remaning` //string interpulation
}

function renderLists() {
    lists.forEach(list => {
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add("list-name")
        listElement.innerText = list.name
        if (list.id === selectedListId) {       //selected id 
            listElement.classList.add('active-list')    
        }
        listsContainer.appendChild(listElement)
    })
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }

}

render()