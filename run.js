const { exec } = require('child_process');

const com = ["build:common", "build:esm", "build:production"];

com.forEach(c => exec(`yarn run ${c}`, (err) => {
    if (err) {
        console.error(err);
    }
}));
