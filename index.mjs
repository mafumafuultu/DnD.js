/**
 * author: mafumafuultu
 * license: MIT
 * homepage: https://github.com/mafumafuultu/DnD.js#readme
 */
const toProm = v => v == null ? Promise.reject() : Promise.resolve(v);
const dragAllows = ['', 'none', 'copy', 'move', 'link', 'copyMove', 'copyLink', 'linkMove', 'all'];
const dropEffects = ['', 'move', 'copy', 'link', 'none'];
const attr = (el, k, v) => (el.setAttribute(k, v), el);
const toDraggable = e => attr(e, 'draggable', 'true');
const setFn = (o, v) => (o[v] = { fn: e => { }, set(f) { this.fn = f; } }, o);
const nsUnique = ns => `${ns}_unique`;
function* uniqueID() {
	let i = 0;
	while (true) yield i++;
}

const evmap = (ns, v, fn) => ev => fn(ev, ns, v);
const ev_on = (ev, target, fn = (e, data) => { }) => {
	document.addEventListener(ev, function (e, data) {
		Array.from(document.querySelectorAll(target)).filter(el => el === e.target).forEach(el => {
			fn(e, data);
		});
	})
};

const DnD = {
	nsUnique,
	Dragstart: {},
	Drag: {},
	Dragend: {},
	Dragenter: {},
	Dragover: {},
	Dragleave: {},
	Drop: {},
	UniqueID: {},
	unique: 'application/unique',
	uniqueEL: (e, ns) => toProm(document.querySelector(`[data-${ns}_unique="${e.dataTransfer.getData(DnD.unique)}"]`)),
	dragstart: (e, ns, mode) => {
		e.dataTransfer.effectAllowed = mode;
		e.dataTransfer.setData(DnD.unique, e.target.dataset[`${DnD.nsUnique(ns)}`]);
		DnD.Dragstart[ns][mode].fn(e, ns);
	},
	drag: (e, ns, mode) => {
		e.preventDefault();
		DnD.Drag[ns][mode].fn(e, ns);
	},
	dragend: (e, ns, mode) => {
		e.preventDefault();
		e.stopPropagation();
		DnD.Dragend[ns][mode].fn(e, ns);
	},
	dragenter: (e, ns, mode) => {
		e.preventDefault();
		DnD.Dragenter[ns][mode].fn(e, ns);
	},
	dragover: (e, ns, mode) => {
		e.preventDefault();
		e.stopPropagation();
		e.dataTransfer.dropEffect = mode;
		DnD.Dragover[ns][mode].fn(e, ns);
	},
	dragleave: (e, ns, mode) => {
		e.preventDefault();
		DnD.Dragleave[ns][mode].fn(e, ns);
	},
	drop: (e, ns, mode) => {
		e.stopPropagation();
		DnD.Drop[ns][mode].fn(e, ns);
	},
	async setup(ns = 'dd', doc = window.document) {
		return (doc.readyState !== 'complete'
			? new Promise(r => doc.addEventListener('readystatechange', () => {
				switch (doc.readyState) {
					case 'complete': return r(ns);
					default:
				}
			}))
			: Promise.resolve(ns)).then(this.dnd_setup);
	},
	dnd_setup(ns = 'dd') {
		DnD.drags = [DnD.Dragstart, DnD.Drag, DnD.Dragend];
		DnD.drops = [DnD.Dragenter, DnD.Dragover, DnD.Dragleave, DnD.Drop];

		const drag_cls = `.${ns}-drag`;
		const drop_cls = `.${ns}-drop`;
		DnD.drags.forEach(dg => dropEffects.reduce(setFn, dg[ns] = {}));
		DnD.drops.forEach(dp => dragAllows.reduce(setFn, dp[ns] = {}));
		DnD.UniqueID[ns] = {
			fn: uniqueID(),
			get() { return this.fn.next().value; },
			refresh() { this.fn = uniqueID(); }
		};

		dropEffects.forEach(v => {
			let tg = v ? `${drag_cls}-${v}` : drag_cls;
			Array.from(document.querySelectorAll(tg)).forEach(el => toDraggable(el).dataset[`${DnD.nsUnique(ns)}`] = DnD.UniqueID[ns].get());

			ev_on('dragstart', tg, evmap(ns, v, DnD.dragstart));
			ev_on('drag', tg, evmap(ns, v, DnD.drag));
			ev_on('dragend', tg, evmap(ns, v, DnD.dragend));
		});
		dragAllows.forEach(v => {
			let tg = v ? `${drop_cls}-${v}` : drop_cls;
			ev_on('dragenter', tg, evmap(ns, v, DnD.dragenter));
			ev_on('dragover', tg, evmap(ns, v, DnD.dragover));
			ev_on('dragleave', tg, evmap(ns, v, DnD.dragleave));
			ev_on('drop', tg, evmap(ns, v, DnD.drop));
		});
		return ns;
	},
	reNumber: ns => {
		const uniID = DnD.UniqueID[ns];
		uniID.refresh();
		const key = nsUnique(ns);
		const drag_cls = `.${ns}-drag`;
		dropEffects.forEach(v => document.querySelectorAll(v ? `${drag_cls}-${v}` : drag_cls).forEach(e => e.dataset[key] = uniID.get()));
	},
	shiftDrop: e => e.dataTransfer.effectAllowed = e.ctrlKey ? 'copy' : e.shiftKey ? 'move' : e.dataTransfer.effectAllowed,
};
export default DnD;