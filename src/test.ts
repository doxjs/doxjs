import DoxJS from "./index";

const actions = {
    inc: (store, value = 1) => {
        store.value += value;
    },
    dec: (store, value = 1) => {
        store.value -= value;
    }
}
const listeners = {
    display: function(store) {
        this.log(store.value);
    },
    log: () => {
        console.log(`data changed at ${(new Date()).getTime()}`);
    }
}

let dox = new DoxJS({
    value: 10
});

dox.bindActions(actions);
dox.bindListeners(listeners);

dox.subscribe("display", false, console);
dox.subscribe("log");
dox.subscribe((store) => {
    console.log(`detected value is ${store.value}`);
});

dox.dispatch("inc", 5);
dox.dispatch("dec", 3);

dox.observe().value = 100;
