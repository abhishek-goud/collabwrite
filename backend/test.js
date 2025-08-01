let a = null;
console.log("start of script");
const func = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            a = "{not null}";
            console.log('This is a delayed message');
            resolve(); // resolve the promise after 5 seconds
        }, 5000);

        
    });
};

const funx = async () => {
    console.log("hey");
    await func()
    console.log(a)
}
console.log(a);

funx()

console.log("end of script");
