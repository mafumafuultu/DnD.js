/**
 * author: mafumafuultu
 * license: MIT
 * homepage: https://github.com/mafumafuultu/DnD.js#readme
 */
const Dragstart = {};
const Drag = {};
const Dragend = {};
const Dragenter = {};
const Dragover = {};
const Dragleave = {};
const Drop = {};
const UniqueID = {};
const drags = [Dragstart,Drag,Dragend];
const drops = [Dragenter,Dragover,Dragleave,Drop];
const toProm = v => v == null ? Promise.reject() : Promise.resolve(v);
const dragAllows = ['', 'none', 'copy', 'move', 'link', 'copyMove', 'copyLink', 'linkMove', 'all'];
const dropEffects = ['', 'move', 'copy', 'link', 'none'];
const attr = (el, k, v) => (el.setAttribute(k, v), el);
const attrs = (el, o) => Object.entries(o).reduce((e, [k, v]) => attr(e, k, v), el);
const toDraggable = e => attr(e, 'draggable', 'true');
const setFn = (o, v) => (o[v] = {fn: e => {}, set(f) {this.fn = f;}}, o);
const nsUnique = ns => `${ns}_unique`;
const DnD = {
	unique: 'application/unique',
	uniqueEL: (e, ns) => toProm(document.querySelector(`[data-${ns}_unique="${e.dataTransfer.getData(DnD.unique)}"]`)),
};
const dragstart = (e, ns, mode) => {
	e.dataTransfer.effectAllowed = mode;
	e.dataTransfer.setData(DnD.unique, e.target.dataset[`${nsUnique(ns)}`]);
	Dragstart[ns][mode].fn(e, ns);
};
const drag = (e, ns, mode) => {
	e.preventDefault();
	Drag[ns][mode].fn(e, ns);
};
const dragend = (e, ns, mode) => {
	e.preventDefault();
	e.stopPropagation();
	Dragend[ns][mode].fn(e, ns);
};
const dragenter = (e, ns, mode) => {
	e.preventDefault();
	Dragenter[ns][mode].fn(e, ns);
};
const dragover = (e, ns, mode) => {
	e.preventDefault();
	e.stopPropagation();
	e.dataTransfer.dropEffect = mode;
	Dragover[ns][mode].fn(e, ns);
};
const dragleave = (e, ns, mode) => {
	e.preventDefault();
	Dragleave[ns][mode].fn(e, ns);
};
const drop = (e, ns, mode) => {
	e.stopPropagation();
	Drop[ns][mode].fn(e, ns);
};
function* uniqueID() {
	let i = 0;
	while (true) yield i++;
}
const drag_setting = (ns, v) => el => {
	el.dataset[`${nsUnique(ns)}`] = UniqueID[ns].get();
	attrs(toDraggable(el), {
		ondragstart: `dragstart(event, '${ns}', '${v}')`,
		ondrag: `drag(event, '${ns}', '${v}')`,
		ondragend: `dragend(event, '${ns}', '${v}')`,
	});
};
const drop_setting = (ns, v) => el => {
	attrs(el, {
		ondragenter: `dragenter(event, '${ns}', '${v}')`,
		ondragover: `dragover(event, '${ns}', '${v}')`,
		ondragleave: `dragleave(event, '${ns}', '${v}')`,
		ondrop: `drop(event, '${ns}', '${v}')`
	});
};
const dnd_setup = (ns = 'dd') => {
	const drag_cls = `.${ns}-drag`;
	const drop_cls = `.${ns}-drop`;
	drags.forEach(dg => dropEffects.reduce(setFn, dg[ns] = {}));
	drops.forEach(dp => dragAllows.reduce(setFn, dp[ns] = {}));
	UniqueID[ns] = {
		fn: uniqueID(),
		get() {return this.fn.next().value;},
		refresh() {this.fn = uniqueID();}
	};
	dropEffects.forEach(v => document.querySelectorAll(v ? `${drag_cls}-${v}` : drag_cls).forEach(drag_setting(ns, v)));
	dragAllows.forEach(v => document.querySelectorAll(v ? `${drop_cls}-${v}` : drop_cls).forEach(drop_setting(ns, v)));
};
const reNumber = ns => {
	const uniID = UniqueID[ns];
	uniID.refresh();
	const key = nsUnique(ns);
	const drag_cls = `.${ns}-drag`;
	dropEffects.forEach(v => document.querySelectorAll(v ? `${drag_cls}-${v}` : drag_cls).forEach(e => e.dataset[key] = uniID.get()));
};