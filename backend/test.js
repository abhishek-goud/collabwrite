// let a = null;
// console.log("start of script");
// const func = () => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             a = "{not null}";
//             console.log('This is a delayed message');
//             resolve(); // resolve the promise after 5 seconds
//         }, 5000);

const getRedisClient = require("./config");

        
//     });
// };

// const funx = async () => {
//     console.log("hey");
//     await func()
//     console.log(a)
// }
// console.log(a);

// funx()

// console.log("end of script");



// const useCount =(value) => {
//     let count = value || 0;
    
//     const setCount = () => {
//         count++;
//     }

//     return [count, setCount];
// }


// const [count, setCount] = useCount(1);
// setCount();
// console.log(count);

// const [count2, setCount2] = useCount(5);
// setCount2();
// console.log(count2);



const greet = () => {
    console.log("hello",getName())
}

greet()

function getName ()  {
    return "alice";
}

// getName = () => {
//     return "alice";
// }


async function func(){
    const redis = await getRedisClient();
    await redis.set("hii", "bye")
    console.log(await redis.get("hii"))
}


func()


