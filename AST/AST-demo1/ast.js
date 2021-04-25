const fs = require('fs');
const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');

const program = fs.readFileSync('./src/demo.js').toString();
const AST = esprima.parseScript(program);
fs.writeFileSync('./src/ast-before.json', JSON.stringify(AST, null, 2));

function walkIn(ast) {
  estraverse.traverse(ast, {
    enter: node => {
      toEqual(node);
      setParseInt(node);
    }
  })
}

function toEqual(node) {
  if (node.operator === '==') {
    node.operator = '===';
  }
}

function setParseInt(node) {
  if (node.type === 'CallExpression' && node.callee.name === 'parseInt' && node.arguments.length === 1) {
    node.arguments.push({
      type: 'Literal',
      value: 10
    })
  }
}

walkIn(AST);
fs.writeFileSync('./src/ast-after.json', JSON.stringify(AST, null, 2));
fs.writeFileSync('./src/demo-after.js', escodegen.generate(AST, {
  format: {
    indent: {
      style: '  ',
      base: 0,
    },
    newline: '\n'
  }
}));
