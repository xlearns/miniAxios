console.time('for');
for (var i = 0; i < 100000000; i++) {
	i / 2;
}
console.timeEnd('for');
console.time('while');
var i = 0;
while (i++ < 100000000) {
	i / 2;
}
console.timeEnd('while');
