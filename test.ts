import DoxJS from './src/index';

let doxjs = new DoxJS({
    name: "Hello world!",
    age: 20,
    address: {
        country: "China",
        province: "Sichuan",
        city: "LuZhou"
    },
    interests: [
        'comic',
        'animate',
        'game',
        'peace'
    ]
});

doxjs.subscribe(store => {
    console.log(store.age);
    store.address.country = 'SSSS';
});

// doxjs.subscribe(store => {
//     console.log(store.age);
// });

// doxjs.subscribe(store => {
//     console.log(store.address);
// });

// doxjs.subscribe(store => {
//     console.log(store.interests[store.interests.length - 1]);
// });

let store = doxjs.observe();

store.address = {
    country: "Chin",
    province: "Sichuan",
    city: "LuZhou"
};
// store.age = 21;
// store.interests.pop()
