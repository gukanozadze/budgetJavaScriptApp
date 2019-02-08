/*
1. Add Event Handler
2. Get input values
3. Add new income or exspense and update UI
4. Calculate new budget and update UI
*/

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
            
            ID = data.allItems.type[data.allItems.type.length - 1]
            newItem = type === "exp" ? new Exspense(ID, des, val) : new Income(ID, des, val);
            // if (type === "exp"){
            //     newItem = new Exspense(ID, des, val);
            // }else{
            //     newItem = new Income(ID, des, val);
            // }
            data.allItems[type].push(newItem)

            return newItem
        },

    }










})();

var Exspense = function(id, description, value){
    this.id = id
    this.description = description
    this.value = value
}
// UI CONTROLLER
var UIController = (function(){
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn'
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

        // 3. add new item to UI

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







