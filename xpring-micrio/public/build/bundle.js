
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.30.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Monetization.svelte generated by Svelte v3.30.0 */

    const { console: console_1 } = globals;
    const file = "src/Monetization.svelte";

    // (113:0) {#if showMessage && !hasPaid}
    function create_if_block_1(ctx) {
    	let div;
    	let button;
    	let t0;
    	let strong;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			t0 = text("\n    Like this content?\n    ");
    			strong = element("strong");
    			strong.textContent = "Support the creator!";
    			attr_dev(button, "class", "delete");
    			add_location(button, file, 114, 4, 2625);
    			attr_dev(strong, "class", "svelte-u5vwpt");
    			add_location(strong, file, 116, 4, 2717);
    			attr_dev(div, "class", "notification is-success svelte-u5vwpt");
    			add_location(div, file, 113, 2, 2583);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(div, t0);
    			append_dev(div, strong);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler*/ ctx[7], false, false, false),
    					listen_dev(strong, "click", /*onPay*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(113:0) {#if showMessage && !hasPaid}",
    		ctx
    	});

    	return block;
    }

    // (120:0) {#if hasPaid}
    function create_if_block(ctx) {
    	let div;
    	let button;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			t = text("\n    Awesome! Thank you for donating.");
    			attr_dev(button, "class", "delete");
    			add_location(button, file, 121, 4, 2845);
    			attr_dev(div, "class", "notification is-success svelte-u5vwpt");
    			add_location(div, file, 120, 2, 2803);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(120:0) {#if hasPaid}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let t0;
    	let t1;
    	let aside;
    	let div6;
    	let span;
    	let t2;
    	let div5;
    	let div1;
    	let label0;
    	let t4;
    	let div0;
    	let input0;
    	let t5;
    	let div3;
    	let label1;
    	let t7;
    	let div2;
    	let input1;
    	let t8;
    	let div4;
    	let button;
    	let mounted;
    	let dispose;
    	let if_block0 = /*showMessage*/ ctx[2] && !/*hasPaid*/ ctx[1] && create_if_block_1(ctx);
    	let if_block1 = /*hasPaid*/ ctx[1] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			aside = element("aside");
    			div6 = element("div");
    			span = element("span");
    			t2 = space();
    			div5 = element("div");
    			div1 = element("div");
    			label0 = element("label");
    			label0.textContent = "Ripple account";
    			t4 = space();
    			div0 = element("div");
    			input0 = element("input");
    			t5 = space();
    			div3 = element("div");
    			label1 = element("label");
    			label1.textContent = "Ripple account token";
    			t7 = space();
    			div2 = element("div");
    			input1 = element("input");
    			t8 = space();
    			div4 = element("div");
    			button = element("button");
    			button.textContent = "Donate";
    			attr_dev(span, "class", "handle svelte-u5vwpt");
    			add_location(span, file, 127, 4, 3015);
    			attr_dev(label0, "class", "label");
    			attr_dev(label0, "for", "account-name");
    			add_location(label0, file, 130, 8, 3139);
    			attr_dev(input0, "class", "input");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "account-name");
    			add_location(input0, file, 132, 10, 3242);
    			attr_dev(div0, "class", "control");
    			add_location(div0, file, 131, 8, 3210);
    			attr_dev(div1, "class", "field");
    			add_location(div1, file, 129, 6, 3111);
    			attr_dev(label1, "class", "label");
    			attr_dev(label1, "for", "auth-token");
    			add_location(label1, file, 141, 8, 3432);
    			attr_dev(input1, "class", "input");
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "id", "auth-token");
    			add_location(input1, file, 143, 10, 3539);
    			attr_dev(div2, "class", "control");
    			add_location(div2, file, 142, 8, 3507);
    			attr_dev(div3, "class", "field");
    			add_location(div3, file, 140, 6, 3404);
    			attr_dev(button, "class", "button is-primary");
    			add_location(button, file, 152, 8, 3736);
    			attr_dev(div4, "class", "field has-addons");
    			add_location(div4, file, 151, 6, 3697);
    			attr_dev(div5, "class", "form-fields svelte-u5vwpt");
    			add_location(div5, file, 128, 4, 3079);
    			attr_dev(div6, "class", "form svelte-u5vwpt");
    			toggle_class(div6, "open", /*isOpen*/ ctx[0]);
    			add_location(div6, file, 126, 2, 2972);
    			attr_dev(aside, "class", "svelte-u5vwpt");
    			add_location(aside, file, 125, 0, 2962);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, aside, anchor);
    			append_dev(aside, div6);
    			append_dev(div6, span);
    			append_dev(div6, t2);
    			append_dev(div6, div5);
    			append_dev(div5, div1);
    			append_dev(div1, label0);
    			append_dev(div1, t4);
    			append_dev(div1, div0);
    			append_dev(div0, input0);
    			set_input_value(input0, /*accountName*/ ctx[3]);
    			append_dev(div5, t5);
    			append_dev(div5, div3);
    			append_dev(div3, label1);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			append_dev(div2, input1);
    			set_input_value(input1, /*authToken*/ ctx[4]);
    			append_dev(div5, t8);
    			append_dev(div5, div4);
    			append_dev(div4, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(span, "click", /*click_handler_2*/ ctx[9], false, false, false),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[10]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[11]),
    					listen_dev(button, "click", /*onPay*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*showMessage*/ ctx[2] && !/*hasPaid*/ ctx[1]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*hasPaid*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*accountName*/ 8 && input0.value !== /*accountName*/ ctx[3]) {
    				set_input_value(input0, /*accountName*/ ctx[3]);
    			}

    			if (dirty & /*authToken*/ 16 && input1.value !== /*authToken*/ ctx[4]) {
    				set_input_value(input1, /*authToken*/ ctx[4]);
    			}

    			if (dirty & /*isOpen*/ 1) {
    				toggle_class(div6, "open", /*isOpen*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(aside);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const SERVER_ADDRESS = "http://localhost:5100";

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Monetization", slots, []);
    	let { paymentPointer } = $$props;
    	let isOpen = false;
    	let hasPaid = false;
    	let showMessage = true;
    	let accountName = "";
    	let authToken = "";

    	function saveCredentials() {
    		sessionStorage.setItem("accountName", accountName);
    		sessionStorage.setItem("authToken", authToken);
    	}

    	async function onPay() {
    		console.log(accountName, authToken, paymentPointer);

    		if (!authToken || !accountName) {
    			$$invalidate(0, isOpen = true);
    			return;
    		}

    		await pay();
    	}

    	async function pay() {
    		fetch(`${SERVER_ADDRESS}/pay`, {
    			method: "POST",
    			headers: {
    				"Content-Type": "application/json",
    				"Access-Control-Allow-Origin": SERVER_ADDRESS
    			},
    			mode: "cors",
    			credentials: "include",
    			body: JSON.stringify({
    				amount: 1,
    				accountName,
    				authToken,
    				paymentPointer
    			})
    		}).then(response => response.json()).then(result => {
    			if (result.successfulPayment === true) {
    				$$invalidate(1, hasPaid = true);
    			} else {
    				console.log("Payment failed.");
    			}
    		});
    	}

    	const writable_props = ["paymentPointer"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Monetization> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(2, showMessage = false);
    	const click_handler_1 = () => $$invalidate(2, showMessage = false);
    	const click_handler_2 = () => $$invalidate(0, isOpen = !isOpen);

    	function input0_input_handler() {
    		accountName = this.value;
    		$$invalidate(3, accountName);
    	}

    	function input1_input_handler() {
    		authToken = this.value;
    		$$invalidate(4, authToken);
    	}

    	$$self.$$set = $$props => {
    		if ("paymentPointer" in $$props) $$invalidate(6, paymentPointer = $$props.paymentPointer);
    	};

    	$$self.$capture_state = () => ({
    		SERVER_ADDRESS,
    		paymentPointer,
    		isOpen,
    		hasPaid,
    		showMessage,
    		accountName,
    		authToken,
    		saveCredentials,
    		onPay,
    		pay
    	});

    	$$self.$inject_state = $$props => {
    		if ("paymentPointer" in $$props) $$invalidate(6, paymentPointer = $$props.paymentPointer);
    		if ("isOpen" in $$props) $$invalidate(0, isOpen = $$props.isOpen);
    		if ("hasPaid" in $$props) $$invalidate(1, hasPaid = $$props.hasPaid);
    		if ("showMessage" in $$props) $$invalidate(2, showMessage = $$props.showMessage);
    		if ("accountName" in $$props) $$invalidate(3, accountName = $$props.accountName);
    		if ("authToken" in $$props) $$invalidate(4, authToken = $$props.authToken);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isOpen,
    		hasPaid,
    		showMessage,
    		accountName,
    		authToken,
    		onPay,
    		paymentPointer,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		input0_input_handler,
    		input1_input_handler
    	];
    }

    class Monetization extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { paymentPointer: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Monetization",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*paymentPointer*/ ctx[6] === undefined && !("paymentPointer" in props)) {
    			console_1.warn("<Monetization> was created without expected prop 'paymentPointer'");
    		}
    	}

    	get paymentPointer() {
    		throw new Error("<Monetization>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set paymentPointer(value) {
    		throw new Error("<Monetization>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Micrio.svelte generated by Svelte v3.30.0 */
    const file$1 = "src/Micrio.svelte";

    // (33:0) {#if isMonetized}
    function create_if_block$1(ctx) {
    	let monetization;
    	let current;

    	monetization = new Monetization({
    			props: {
    				paymentPointer: /*paymentPointer*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(monetization.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(monetization, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const monetization_changes = {};
    			if (dirty & /*paymentPointer*/ 1) monetization_changes.paymentPointer = /*paymentPointer*/ ctx[0];
    			monetization.$set(monetization_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(monetization.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(monetization.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(monetization, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(33:0) {#if isMonetized}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let t;
    	let if_block_anchor;
    	let current;
    	let if_block = /*isMonetized*/ ctx[1] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(div, "id", "micrio");
    			attr_dev(div, "class", "svelte-9gfw8t");
    			add_location(div, file$1, 30, 0, 570);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isMonetized*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isMonetized*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Micrio", slots, []);
    	let { micrioId = "" } = $$props;

    	let micrioInstance = new Micrio({
    			id: micrioId,
    			container: document.getElementById("micrio"),
    			hookEvents: true,
    			autoInit: true,
    			minimap: false,
    			initType: "cover"
    		});

    	micrioInstance.addEventListener("load", e => {
    		$$invalidate(0, paymentPointer = e.detail.custom.wallet_address);
    		$$invalidate(1, isMonetized = !!paymentPointer);
    	});

    	const writable_props = ["micrioId"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Micrio> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("micrioId" in $$props) $$invalidate(2, micrioId = $$props.micrioId);
    	};

    	$$self.$capture_state = () => ({
    		Monetization,
    		micrioId,
    		micrioInstance,
    		paymentPointer,
    		isMonetized
    	});

    	$$self.$inject_state = $$props => {
    		if ("micrioId" in $$props) $$invalidate(2, micrioId = $$props.micrioId);
    		if ("micrioInstance" in $$props) micrioInstance = $$props.micrioInstance;
    		if ("paymentPointer" in $$props) $$invalidate(0, paymentPointer = $$props.paymentPointer);
    		if ("isMonetized" in $$props) $$invalidate(1, isMonetized = $$props.isMonetized);
    	};

    	let paymentPointer;
    	let isMonetized;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	 $$invalidate(0, paymentPointer = null);
    	 $$invalidate(1, isMonetized = false);
    	return [paymentPointer, isMonetized, micrioId];
    }

    class Micrio_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { micrioId: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Micrio_1",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get micrioId() {
    		throw new Error("<Micrio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set micrioId(value) {
    		throw new Error("<Micrio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.30.0 */
    const file$2 = "src/App.svelte";

    function create_fragment$2(ctx) {
    	let main;
    	let micrio;
    	let current;

    	micrio = new Micrio_1({
    			props: { micrioId: "bndeI" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(micrio.$$.fragment);
    			add_location(main, file$2, 12, 0, 170);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(micrio, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(micrio.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(micrio.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(micrio);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Micrio: Micrio_1 });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    const app = new App({
      target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
