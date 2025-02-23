// Metodos de manipulacion de arrays
// Push añade el valor al final
let fruta = ["manzana", "pera"];
console.log(fruta);
fruta.push("naranja");
console.log(fruta);

// unshift añade el valor al iniccio
let animal = ["perro", "gato"];
console.log(animal);
fruta.unshift("tigre");
console.log(animal);

// pop elimina el valor al final
let ciudad = ["medellin", "bogota"];
console.log(ciudad);
fruta.pop("cali");
console.log(ciudad);

// shift elimina el valor al iniio
let nombre = ["angie", "paola"];
console.log(nombre);
fruta.shift("teo");
console.log(nombre);


//map me devuelve un array nuevo
let numeros = [1, 2, 3];
let cuadrados = numeros.map(n => n * n);
console.log(numeros);
console.log(cuadrados);

//filtre fitra

//reserve invierte el orden

//se usa para acceder a un elemento específico 

//desectructuracion sacar los valores de una lista a la fuerza y meterlos en un variable 
let cosas = [1, "manzana ", "medellin", 2]
let = [numero1, fruta, ciudad] = cosas;

//Spread ... fucionr  una lista nueva 
//REst destructurar 


// Metodos de manipulacion de objetos

let persona = {
    nombre: "Ana",
    edad: 25,
    direccion: {
        ciudad: "medellin",
        barrio: " el poblado"
    }
}

let enties = Object.entries(persona);
console.log(enties)


let persona1 = {
    
}