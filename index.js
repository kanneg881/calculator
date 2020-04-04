/**
 * @type {boolean} 計算機發生錯誤，例如除0的錯誤
 */
var error = false
/**
 * @type {array} 記憶體計算機 M+ M- 功能
 */
var memoryOperand = []
/**
 * @type {array} 計算機運算元
 */
var operand = []
/**
 * @type {string} 計算機運算子
 */
var operator = ''
/**
 * @type {string} 選擇的運算子 + - * /
 */
var selectedOperator = ''

/*
 * 計算
 *
 * @param operator {string} 運算子
 */
function calculate (operator) {
  /**
   * @type {number} 運算元左
   */
  let operandLeft = Number(this.operand.pop())
  /**
   * @type {number|string} 計算結果
   */
  let resultText = getFormatResult()
  /**
   * @type {number} 運算元右
   */
  let operandRight = Number(resultText)

  // 清除運算元
  this.operator = ''

  switch (operator) {
    case '+':
      resultText = operandLeft + operandRight
      break
    case '-':
      resultText = operandLeft - operandRight
      break
    case '*':
      resultText = operandLeft * operandRight
      break
    case '/':
      if (resultText === '0') {
        outputResult('錯誤，請按 C 或 CE')
        outputFormula()
        error = true

        return
      }
      resultText = operandLeft / operandRight
      break
    case '%':
      resultText = operandLeft % operandRight
      break
    // 沒有計算公式不需更新
    default:
      return
  }
  outputResult(resultText)
  outputFormula(operandLeft + ' ' + operator + ' ' + operandRight + ' = ' + resultText)
}

/**
 * 清除全部，包括記憶的數字，不包括記憶體的數字
 * 相當於計算機的 C
 */
function clearAll () {
  error = false
  operand = []
  operator = ''
  selectedOperator = ''
  outputFormula()
  outputOperator()
  outputResult()
}

/**
 * 轉換成浮點數
 */
function convertToFloat () {
  // 發生錯誤，不允許繼續計算
  if (error) {
    return
  }
  /**
   * @type {string} 計算結果
   */
  let resultText = getFormatResult()

  // 第一個按的是小數點
  if (selectedOperator !== '') {
    if (selectedOperator !== '=') {
      outputFormula(resultText + ' ' + selectedOperator)
    }
    operand.push(resultText)
    outputResult('0.')
    operator = selectedOperator
    selectedOperator = ''
    outputOperator()

    return
  }

  // 已經存在小數點了
  if (resultText.indexOf('.') !== -1) {
    return
  }
  outputResult(resultText + '.')
}

/**
 * 清除當前輸入，相當於計算機的 CE
 */
function currentEmpty () {
  outputResult()
  error = false
}

/**
 * 刪除最後一個字元，包含小數點也行
 */
function deleteLastCharacter () {
  // 發生錯誤，不允許繼續計算
  if (error) {
    return
  }

  // 已選擇運算子
  if (selectedOperator !== '') {
    return
  }
  /**
   * @type {string} 計算結果
   */
  let resultText = getFormatResult()

  resultText.length === 1
    ? outputResult()
    : outputResult(resultText.slice(0, -1))
}

/**
 * 按等於 =
 */
function equal () {
  // 發生錯誤，不允許繼續計算
  if (error) {
    return
  }

  // 如果之前已經選擇過運算子，就計算
  if (this.operator !== '') {
    calculate(this.operator)
    // 計算完才能算有選擇等於 =
    selectedOperator = '='
    outputOperator()
  }
}

/**
 * 取得格式化的公式
 *
 * @param formula {string} 公式
 * @return {string} 格式化的公式
 */
function getFormatFormula (formula) {
  formula = formula.replace(/\*/g, 'x')
  formula = formula.replace(/\//g, '÷')

  return formula
}

/**
 * 取得格式化運算子
 *
 * @param operator {string} 運算子
 * @return {string} 格式化運算子
 */
function getFormatOperator (operator) {
  if (operator === '*') {
    return 'x'
  }

  if (operator === '/') {
    return '÷'
  }

  return operator
}

/**
 * 取得格式化的結果
 *
 * @return {string} 格式化的結果
 */
function getFormatResult () {
  /**
   * @type {HTMLElement} 計算結果
   */
  let resultOutput = document.querySelector('.result')
  /**
   * @type {string} 計算結果
   */
  let resultText = resultOutput.innerText

  // 清除最後一個字為小數點
  if (resultText.charAt(resultText.length - 1) === '.') {
    resultText.slice(0, -1)
  }

  return resultText
}

/**
 * 插入整數
 *
 * @param {string} number 0~9 字串
 */
function insertNumber (number) {
  // 發生錯誤，不允許繼續計算
  if (error) {
    return
  }
  /**
   * @type {string} 計算結果
   */
  let resultText = getFormatResult()

  // 選擇運算子非等於 = 和空白
  if (selectedOperator !== '' && selectedOperator !== '=') {
    // 將目前的結果儲存在運算元陣列裡
    operand.push(resultText)
    // 運算子為選擇運算子
    operator = selectedOperator
    outputFormula(resultText + ' ' + selectedOperator)
  }

  // 選擇運算子非空白
  if (selectedOperator !== '') {
    // 清除選擇運算子
    selectedOperator = ''
    outputResult(number)

    return
  }

  // 如果長度超過10位數
  if (resultText.length + 1 > 10) {
    return
  }

  // 一開始的數值為0，輸入的數值為0
  if (resultText === '0' && number === '0') {
    return
  }
  // 一開始的數值是否為0
  resultText === '0'
    ? outputResult(number)
    : outputResult(resultText + number)
}

/**
 * 清除記憶體的數字
 */
function memoryClean () {
  memoryOperand = []
}

/**
 * 記憶體減
 */
function memoryMinus () {
  if (error) {
    return
  }
  memoryOperand.push(-Number(getFormatResult()))
}

/**
 * 記憶體加
 */
function memoryPlus () {
  if (error) {
    return
  }
  memoryOperand.push(Number(getFormatResult()))
}

/**
 * 記憶體總和
 */
function memoryRecall () {
  /**
   * @type {number} 總和
   */
  let sum = 0

  memoryOperand.forEach(value => {
    sum += value
  })
  outputResult(sum)
}

/**
 * 輸出公式
 *
 * @param formula {string} 公式
 */
function outputFormula (formula = '') {
  /**
   * @type {HTMLElement} 公式
   */
  let formulaOutput = document.querySelector('.formula')

  formulaOutput.innerText = getFormatFormula(formula)
}

/**
 * 輸出運算子
 *
 * @param operator {string} 運算子
 */
function outputOperator (operator = '') {
  /**
   * @type {HTMLElement} 輸出運算子
   */
  let operatorOutput = document.querySelector('.operator')

  operatorOutput.innerText = getFormatOperator(operator)
}

/**
 * 輸出結果
 *
 * @param result {string|number} 結果
 */
function outputResult (result = '0') {
  /**
   * @type {HTMLElement} 計算結果
   */
  let resultOutput = document.querySelector('.result')

  resultOutput.innerText = result
}

/**
 * 選擇運算子
 *
 * @param {string} operator 運算子
 */
function selectOperator (operator) {
  // 發生錯誤，不允許繼續計算
  if (error) {
    return
  }

  // 取消選取運算子
  if (selectedOperator === operator) {
    selectedOperator = ''
    outputOperator()

    return
  }
  selectedOperator = operator
  outputOperator(operator)
  outputResult(getFormatResult())

  // 如果之前已經選擇過運算子，就計算
  if (this.operator !== '') {
    calculate(this.operator)
  }
}