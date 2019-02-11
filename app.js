
// BUDGET CONTROLLER
var budgetController = (function(){
    
    var Exspense = function(id, description, value){
        this.id = id
        this.description = description
        this.value = value
    }

    var Income = function(id, description, value){
        this.id = id
        this.description = description
        this.value = value
    }

    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        
        totals: {
            exp: 0,
            inc: 0
        }
    }

    return {
        addItem: function(type, des, val){
            var newItem, ID

            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1
            }else{
                ID = 0
            }
            newItem = type === "exp" ? new Exspense(ID, des, val) : new Income(ID, des, val);

            data.allItems[type].push(newItem)

            return newItem
        },
    }
})();


// UI CONTROLLER
var UIController = (function(){
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        expensesList: '.expenses__list',
        incomeList: '.income__list'
    }

    return {
        getInput: function(){
            return{
                type: document.querySelector(DOMStrings.inputType).value, // Will be inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            }        
        },
        getDOMStrings: function(){
            return DOMStrings
        },
        addListItem: function(newItem, type){
            var html, newHtml, element

            if (type === 'inc'){
                element = document.querySelector(DOMStrings.incomeList)

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }else{
                element = document.querySelector(DOMStrings.expensesList)

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } 
            newHtml = html.replace('%id%', newItem.id)
            newHtml = newHtml.replace('%description%', newItem.description)
            newHtml = newHtml.replace('%value%', newItem.value)

            element.insertAdjacentHTML('afterbegin', newHtml)
        }
    }
})();


// GLOBAL CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMStrings()

        // Add Button and Enter
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem)
        document.addEventListener('keypress', function(event){
            if (event.keyCode === 13) ctrlAddItem()
        })
    }


    var ctrlAddItem = function(){

        // 1. Get input data
        var input = UIController.getInput()
        // 2. add value to budget controller
        var newItem = budgetCtrl.addItem(input.type, input.description, input.value)

        // 3. add new item to UI
        UICtrl.addListItem(newItem, input.type)
        
        // 4. Calculate the budget

        // 5. Display the Budget to UI
    } 

    return {
        init: function(){
            console.log("INITED")
            setupEventListeners()
        }
    }    

})(budgetController, UIController);

controller.init()