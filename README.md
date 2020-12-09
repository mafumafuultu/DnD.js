# DnD.js
DnD.js provides the event-handling part of drag and drop, not the actual implementation of copying and moving.

## quick start

```html
<script src="dnd.js"></script>
```

```js
document.onload = () => {
	const namespace = 'dd';
	const allowed = 'move';
	dnd_setup(namespace);
	Drop[namespace][allowed].set((e, ns) => {
		DnD.uniqueEL(e, ns).then(el => {
			e.currentTarget.append(el);
		});
	});
};
```

### set drag target & drop zone

```html
<div class="dd-drag-move">drag able move</div>
<div class="dd-drag-copy">drag able copy</div>

<div class="dd-drop-move">drop zone allow move</div>
<div class="dd-drop-copy">drop zone allow copy</div>
<div class="dd-drop-all">drop zone allow all</div>
```

### functions

#### `dnd_setup(ns = 'dd')`
async function.
set event-handling

```js
dnd_setup();

// OR

const namespaces = ['dd', 'xx', 'yy', 'zz'];
Promise.all(namespaces.map(dnd_setup)).then(() => {
	// complete all set up.
});
```

#### `(Dragstart|Drag|Dragend)[namespace][effectAllowed].set(event, namespace)`

```js
// effectAllowed
// ['', 'none', 'copy', 'move', 'link', 'copyMove', 'copyLink', 'linkMove', 'all'];
Dragstart.dd.move.set((e, ns) => {
	console.log('drag target unique id', e.dataTransfer.getData(DnD.unique));
	e.dataTransfer.setData('test', 'a');
})
```

#### `(Dragenter|Dragover|Dragleave|Drop)[namespace][dropEffects].set(event, namespace)`
```js
// dropEffects
// ['', 'move', 'copy', 'link', 'none']
Drop.dd.move.set((e, ns) => {
	console.log('drag target unique id', e.dataTransfer.getData(DnD.unique));
	console.log(e.dataTransfer.getData('test'));

	// Describe the implementation of "Move on Drop".
});
```

#### `DnD.uniqueEL(event, namespace)`
get drag target element.

```js
DnD.uniqueEL(e, ns).then(el => {})
```



#### reNumber(namespace)
update unique number.

```html
<div class="dd-drag-copy" data-dd-unique="1">copy</div>
<div class="dd-drop-all">
	<!-- copy.  -->
	<div class="dd-drag-copy" data-dd-unique="1">copy</div>
</div>
```

```js
Drop.dd.copy.set((e, ns) => {
	DnD.uniqueEL(e, ns).then(el => {
		const clone = el.cloneNode();
		clone.innerHTML = el.innerHTML;
		e.currentTarget.append(clone);

		// unique number update
		reNumber(ns);
	});
});
```

```html
<div class="dd-drag-copy" data-dd-unique="1">copy</div>
<div class="dd-drop-all">
	<!-- copy.  -->
	<div class="dd-drag-copy" data-dd-unique="2">copy</div>
</div>
```