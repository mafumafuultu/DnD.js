# DnD.js
Drag &amp; Drop


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
})
```