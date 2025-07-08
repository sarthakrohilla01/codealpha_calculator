class Calculator {
    constructor() {
        this.display = document.getElementById('main-display');
        this.operationDisplay = document.getElementById('operation-display');
        this.currentInput = '0';
        this.previousValue = null;
        this.operation = null;
        this.waitingForOperand = false;
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        // Button clicks
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleButtonClick(e.target);
            });
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
    }
    
    handleButtonClick(button) {
        // Add visual feedback
        button.classList.add('pressed');
        setTimeout(() => button.classList.remove('pressed'), 100);
        
        const action = button.dataset.action;
        const number = button.dataset.number;
        
        if (number !== undefined) {
            this.inputNumber(number);
        } else if (action) {
            this.handleAction(action);
        }
    }
    
    handleKeyPress(e) {
        e.preventDefault();
        
        if (e.key >= '0' && e.key <= '9') {
            this.inputNumber(e.key);
        } else if (e.key === '.') {
            this.inputDecimal();
        } else if (e.key === '+') {
            this.performOperation('add');
        } else if (e.key === '-') {
            this.performOperation('subtract');
        } else if (e.key === '*' || e.key === '×') {
            this.performOperation('multiply');
        } else if (e.key === '/' || e.key === '÷') {
            this.performOperation('divide');
        } else if (e.key === 'Enter' || e.key === '=') {
            this.handleEquals();
        } else if (e.key === 'Backspace') {
            this.backspace();
        } else if (e.key.toLowerCase() === 'c' || e.key === 'Escape') {
            this.clear();
        }
    }
    
    handleAction(action) {
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'backspace':
                this.backspace();
                break;
            case 'decimal':
                this.inputDecimal();
                break;
            case 'equals':
                this.handleEquals();
                break;
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                this.performOperation(action);
                break;
        }
    }
    
    inputNumber(num) {
        if (this.waitingForOperand) {
            this.currentInput = String(num);
            this.waitingForOperand = false;
        } else {
            this.currentInput = this.currentInput === '0' ? String(num) : this.currentInput + num;
        }
        this.updateDisplay();
    }
    
    inputDecimal() {
        if (this.waitingForOperand) {
            this.currentInput = '0.';
            this.waitingForOperand = false;
        } else if (this.currentInput.indexOf('.') === -1) {
            this.currentInput += '.';
        }
        this.updateDisplay();
    }
    
    clear() {
        this.currentInput = '0';
        this.previousValue = null;
        this.operation = null;
        this.waitingForOperand = false;
        this.updateDisplay();
        this.updateOperationDisplay();
    }
    
    backspace() {
        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
        }
        this.updateDisplay();
    }
    
    performOperation(nextOperation) {
        const inputValue = parseFloat(this.currentInput);
        
        if (this.previousValue === null) {
            this.previousValue = inputValue;
        } else if (this.operation) {
            const currentValue = this.previousValue || 0;
            const newValue = this.calculate(currentValue, inputValue, this.operation);
            
            this.currentInput = String(newValue);
            this.previousValue = newValue;
            this.updateDisplay();
        }
        
        this.waitingForOperand = true;
        this.operation = nextOperation;
        this.updateOperationDisplay();
    }
    
    handleEquals() {
        if (this.operation && this.previousValue !== null) {
            const inputValue = parseFloat(this.currentInput);
            const newValue = this.calculate(this.previousValue, inputValue, this.operation);
            
            this.currentInput = String(newValue);
            this.previousValue = null;
            this.operation = null;
            this.waitingForOperand = true;
            this.updateDisplay();
            this.updateOperationDisplay();
        }
    }
    
    calculate(firstValue, secondValue, operation) {
        switch (operation) {
            case 'add':
                return firstValue + secondValue;
            case 'subtract':
                return firstValue - secondValue;
            case 'multiply':
                return firstValue * secondValue;
            case 'divide':
                return secondValue !== 0 ? firstValue / secondValue : 0;
            default:
                return secondValue;
        }
    }
    
    updateDisplay() {
        this.display.textContent = this.currentInput;
    }
    
    updateOperationDisplay() {
        if (this.previousValue !== null && this.operation) {
            const operatorSymbols = {
                'add': '+',
                'subtract': '−',
                'multiply': '×',
                'divide': '÷'
            };
            this.operationDisplay.textContent = `${this.previousValue} ${operatorSymbols[this.operation]}`;
        } else {
            this.operationDisplay.textContent = '';
        }
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
