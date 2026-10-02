console.log("Que mira PERROOOOO!!!!!")
console.log(2+2)
console.log(1+1)

var direccion = "cl 5 #45 a 341"
console.log(direccion)

const pais = "Colombia"
console.log(pais)

let ciudad = "Popayan"
console.log(ciudad)
ciudad = "cali"
console.log(ciudad)
ciudad = "5"
console.log(ciudad)




//presentacion
const nombres = "Juan Jose"
const apellidos = "Muñoz Yandi"
const fdnacimiento = "12/08/2003"
let edad = "23 años"

let telefono = "3108406482"
let residencia = "el diviso, piendamo, cauca."
let gustos = "Lectura"


console.log(
    "me llamo "+nombres +apellidos+ " tengo "+ edad +" y naci el "+ fdnacimiento+ " mi telefono es " + telefono+ " y vivo en "+ residencia    
)

console.log(35 % 2 == 0)

console.log(5=="5")
console.log(5==="5")
console.log(5 !== "5")
console.log(!true)
console.log(5>=5 && 5<6)
console.log(5>=5 || 5<3)

let nota = 5

if(nota >= 4.5){console.log("xcelente")}else if(nota>=4){console.log("bueno")}
else if(nota >= 3){console.log("rendimiento bajo")}else if(nota <3){console.log ("reprobado")}
else{console.log("no asistio")}





let dia = 6

if(dia == 7){console.log("domingo")} else if(dia == 6){console.log("sabado")}
else if(dia == 5){console.log("viernes")}else if(dia == 4){console.log("jueves")}
else if(dia == 3){console.log("miercoles")}
else if(dia == 2){console.log("martes")}
else if(dia == 1){console.log("lunes")} else{console.log("no valido")}

switch(dia){
    case 1:
        console.log("lunes")
        break;
    case 2:
        console.log("martes")
        break;
    case 3:
        console.log("miercoles")
        break;
    case 4:
        console.log("jueves")
        break;
    case 5:
        console.log("viernes")
        break;
    case 6:
        console.log("sabado")
        break;
    case 7:
        console.log("domingo")
        break;
    default:
        console.log("dia invalido")
        break

}


