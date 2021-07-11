export function randomStringGenerator(max: number): string {
    let result = "";
    const characters = 
    "abcdefghijklmnopqrstuvwxyz0123456789";
    const charsLength = characters.length;
    for ( let i = 0; i < max; i++ ){
        result += characters.charAt(Math.floor(Math.random() * charsLength));
    }
    return result;
};

export function randomNumberGenerator(max: number): string {
    let result = "";
    const characters = 
    "0123456789";
    const charsLength = characters.length;
    for ( let i = 0; i < max; i++ ){
        result += characters.charAt(Math.floor(Math.random() * charsLength));
    }
    return result;
};

export function addZero(no: string | number):string {
    if(typeof no === "number") return no.toString().padStart(4, "0")
    return no.padStart(4, "0");
}

export default {
    randomStringGenerator,
    addZero
}