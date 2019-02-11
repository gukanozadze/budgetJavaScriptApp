// BUDGET CONTROLLER
var budgetController = (function(){
    
    var Expense = function(id, description, value){
        this.id = id
        this.description = description
        this.value = value
        this.percentage = -1
        calcPercentage = function(totalInc){
            if(totalInc > 0){
                this.percentage = Math.round((this.value / totalInc) * 100)
            }else{
                this.percentage = -1
            }
        }
        getPercentage = function(){
            return this.percentage
        }
    }

    var Income = function(id, description, value){
        this.id = id
        this.description = description
        this.value = value
    }

    var calculateTotal = function(type){
        var sum = 0
        data.allItems[type].forEach(function(curr){
            sum = sum + curr.value;
        })
        data.totals[type] = sum
    }

    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }

    return {
        addItem: function(type, des, val){
            var newItem, ID

            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1
            }else{
                ID = 0
            }
            newItem = type === "exp" ? new Expense(ID, des, val) : new Income(ID, des, val);

            data.allItems[type].push(newItem)

            return newItem
        },
        calculateBudget: function(){
            // Calculate total income and Expenses
            calculateTotal('exp')
            calculateTotal('inc')

            // Calculate Budget (Income - Expenses)
            data.budget = data.totals.inc - data.totals.exp

            // Calculate the % of Expenses 
            if (data.totals.inc > 0){
                data.percentage = Math.round(data.totals.exp / data.totals.inc * 100)

            }else{
                data.percentage = -1
            }
        },
        calculatePercentages: function(){
            data.allItems.exp.forEach(function(curr){
                curr.calcPercentage(curr.value)
            })
        },
        getBudget: function(){
            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpenses: data.totals.exp,
                percentage: data.percentage
            }
        },
        testElements: function(){
            return data.allItems
        },
        removeItem: function(id, type){
            var ids, index
            
            ids = data.allItems[type].map(function(curr){
                
                return curr.id; 
            })
            
            index = ids.indexOf(id)

            if(index !== -1){
                data.allItems[type].splice(index, 1)
            }
        }
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
        incomeList: '.income__list',
        budgetValue: '.budget__value',
        budgetIncomeValue: '.budget__income--value',
        budgetExpensesValue: '.budget__expenses--value',
        budgetExpensesPercentage: '.budget__expenses--percentage',
        budgetIncomePercentage: '.budget__income--percentage',
        deleteButton: '.item__delete--btn',
        container: '.container'
    }

    return {
        getInputValue: function(){
            return{
                type: document.querySelector(DOMStrings.inputType).value, // Will be inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
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
        },
        clearInputFields: function(){
            document.querySelector(DOMStrings.inputDescription).value = ""
            document.querySelector(DOMStrings.inputValue).value = ""
        },
        displayBudget: function(data){

            document.querySelector(DOMStrings.budgetValue).innerHTML = data.budget
            document.querySelector(DOMStrings.budgetIncomeValue).innerHTML = data.totalIncome
            document.querySelector(DOMStrings.budgetExpensesValue).innerHTML = data.totalExpenses
            document.querySelector(DOMStrings.budgetExpensesPercentage).innerHTML = data.percentage + "%"
        }
    }
})();


// GLOBAL CONTROLLER
var controller = (function(budgetCtrl, UICtrl){
    var DOM = UICtrl.getDOMStrings()

    var setupEventListeners = function(){

        // Add Button and Enter
        document.querySelector(DOM.container).addEventListener('click', deleteItem)

        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem)
        document.addEventListener('keypress', function(event){
            if (event.keyCode === 13) ctrlAddItem()
        })
    }
    
    var updateBudget = function(){
        // 1. Calculate the budget
        budgetCtrl.calculateBudget()
        // 2. Return Budget
        var budget = budgetCtrl.getBudget()
        // 3. Display the Budget to UI
        UICtrl.displayBudget(budget)
    }

    var updatePercentages = function(){
        
    }

    var ctrlAddItem = function(){

        // 1. Get input data
        var input = UIController.getInputValue()

        // Checking if fields are empty
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            
            // 2. add value to budget controller
            var newItem = budgetCtrl.addItem(input.type, input.description, input.value)

            // 3. add new item to UI
            UICtrl.addListItem(newItem, input.type)

            // 4. Clear Input Fields
            UICtrl.clearInputFields()

            // 5. Give Focus to description
            document.querySelector(DOM.inputDescription).focus()

            // 6. Calc and Update budget
            updateBudget()

            // 7. Update Percentages
            updatePercentages()

            
        }else{
            alert("Description or Value is empty")
        }
    } 

    var deleteItem = function(event){
        var itemID, itemType, currentItemID

        currentItem = event.target.closest('.item')
        if (currentItem.id.includes  ("income") || currentItem.id.includes  ("expense")){

            // 1. Get info of item
            itemID = currentItem.id.split('-')[1]
            itemType = currentItem.id.split('-')[0] === "income" ? "inc" : "exp"

            // 2. Remove from budget
            budgetCtrl.removeItem(parseInt(itemID), itemType)

            // 3. Delete from UI
            currentItem.remove()

            // 4. Update Budget 
            updateBudget()

            // 5. Update Percentages
            updatePercentages()
        }
    }

    return {
        init: function(){
            console.log("Initialized")
            UICtrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpenses: 0,
                percentage: -1
            })
            setupEventListeners()
        }
    }    

})(budgetController, UIController);

controller.init()


