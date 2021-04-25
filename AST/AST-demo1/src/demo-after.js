function fun1(opt) {
  if (opt.status === 1) {
    console.log(1);
  }
  if (opt.status === 2) {
    console.log(1);
  }
}
function fun2(age) {
  if (parseInt(age, 10) >= 18) {
    console.log('OK 成年了');
  }
}
if (true)
  console.log(666);