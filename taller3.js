import readline from 'readline';
import { readFileSync, writeFileSync } from 'fs';

let stockTienda;
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

try {
    const data = readFileSync('stockTienda.json', 'utf8');
    stockTienda = JSON.parse(data);
} catch (error) {
    console.error('Error al leer el archivo:', error);
    stockTienda = {};
}

let persona = {
    Nombre: '',
    Edad: 0, 
};

let carrito = [];

console.log('Bienvenido a nuestra tienda en linea! Por favor ingresa tus datos para continuar con la compra.\n');
rl.question('Por favor ingrese su nombre completo: \n', (nombre) => {

    persona.Nombre = nombre.trim();

    rl.question('Por favor ingrese su edad: \n', (edad) => {
        edad = parseInt(edad);

        if(isNaN(edad) || edad <= 0){
            console.log('Por favor ingrese una edad válida.\n');
            return
        }
        persona.Edad = parseInt(edad);
        console.log(`¡Bienvenido ${persona.Nombre}!`);
        menuPrincipal();
    });
});

function menuPrincipal(){

    console.log('Que deseas realizar: \n');
    console.log('1. Comprar: \n');
    console.log('2. Agregar al carrito: \n');
    console.log('3. Editar cantidad de un productos del carrito: \n');
    console.log('4. Eliminar producto del carrito: \n');
    console.log('5. Ver carrito: \n');
    console.log('6. Finalizar compra y obtener factura: \n');
    console.log('7. Ver historial de compras: \n');
    console.log('8. Salir: \n');

    rl.question('Ingrese una opcion: \n', async (opcion) => {
        switch (opcion.trim()) {
            case '1':
            case '2':
                console.log('---Comprar---\n');
                comprar();
                break;
            case '3':
                console.log('---Editar cantidad de un producto del carrito---\n');
                editarCarrito();
                break;
            case '4':
                console.log('---Eliminar producto del carrito---\n');
                eliminarProductoCarrito();
                break;
            case '5':
                console.log('Ver carrito\n');
                mostrarCarrito();
                break;
            case '6':
                console.log('---Finalizar compra y obtener factura---\n');
                finalizarCompra();
                break;
            case '7':
                console.log('---Ver historial de compras---\n');
                verHistorial();    
            case '8':
                console.log('---Salir---\n');
                cerrarPrograma();
                break;
            default:
                console.log('---Opcion no valida---\n');
                menuPrincipal();
                break;
            }
        });
    }

    async function comprar() {
        console.log('¿Qué deseas comprar?');
        console.log('1. ---Frutas---\n');
        console.log('2. ---Verduras---\n');
        console.log('3. ---Lácteos---\n');
        console.log('4. ---Volver al menú principal---\n');
    
        let opcion = await question('Ingrese una opción: \n');
    
        let categoria;
        switch (opcion.trim()) {
            case '1':
                categoria = 'frutas';
                break;
            case '2':
                categoria = 'verduras';
                break;
            case '3':
                categoria = 'lacteos';
                break;
            case '4':
                console.log('---Volviendo al menú principal---\n');
                menuPrincipal();
                return;
            default:
                console.log('Opción no válida. Intente de nuevo.\n');
                return comprar();
        }
    
        let productosDisponibles = stockTienda[categoria].filter(producto => producto.cantidad > 0);
    
        if (productosDisponibles.length === 0) {
            console.log(`Lo sentimos, no tenemos ${categoria} disponible en este momento.\n`);
            return menuPrincipal();
        }
    
        console.log(`--- ${categoria.charAt(0).toUpperCase() + categoria.slice(1)} disponibles ---\n`);
        productosDisponibles.forEach((producto, index) => {
            console.log(`${index + 1}. ${producto.nombre} - Precio: $${producto.precioUnitario} - Cantidad: ${producto.cantidad}`);
        });
    
        let productoOpcion = await question('Ingrese el número del producto que desea comprar: \n');
        let productoSeleccionado = productosDisponibles[parseInt(productoOpcion) - 1];
    
        if (!productoSeleccionado) {
            console.log('Opción no válida. Intente de nuevo.\n');
            return comprar();
        }
    
        let cantidad = await question(`Ingrese la cantidad de ${productoSeleccionado.nombre} que desea: \n`);
        cantidad = Number(cantidad);
    
        if (isNaN(cantidad) || cantidad <= 0 || !Number.isInteger(cantidad)) {
            console.log('Ingrese una cantidad válida.\n');
            return comprar();
        }
    
        if (cantidad > productoSeleccionado.cantidad) {
            console.log(`Lo sentimos, no hay suficiente stock de ${productoSeleccionado.nombre}.\n`);
            return comprar();
        }
    
        await agregarAlCarrito(categoria, productoSeleccionado.nombre, cantidad);
        menuPrincipal();
    }
    


async function agregarAlCarrito(categoria, nombreProducto, cantidad) {

    if(stockTienda[categoria]){
        const producto = stockTienda[categoria].find(p => p.nombre === nombreProducto);

        if (producto && producto.cantidad >= cantidad) {
            carrito.push({ 
                nombre: producto.nombre,
                precioUnitario: producto.precioUnitario, 
                cantidad: cantidad, 
                categoria: categoria
            });

          producto.cantidad -= cantidad;
          guardarStock();
          console.log(`${cantidad} ${nombreProducto}(s) añadido(s) al carrito.`);
          console.log("-------------------------------\n");
        } else {
          console.log('Stock insuficiente o producto no encontrado.');
        }
      } else {
        console.log('Categoria no valida');
      }
}

async function editarCarrito() {

    mostrarCarrito();

    try {
        let opcion = await question('Seleccione el producto que desea modificar: \n');
        let producto = carrito[parseInt(opcion) - 1];

        if (!producto) {
            console.log('Ingrese una opcion válida.\n');
            return editarCarrito();
        }

        let nuevaCantidad = await question('Ingrese la cantidad que desea: \n');
        nuevaCantidad = Number(nuevaCantidad);

        if (isNaN(nuevaCantidad) || nuevaCantidad <= 0 || !Number.isInteger(nuevaCantidad)) {
            console.log('Ingrese una cantidad válida.\n');
            return editarCarrito();
        }

        let productoStock = stockTienda[producto.categoria].find(p => p.nombre === producto.nombre);

        if (productoStock.cantidad < nuevaCantidad) {
            console.log(`Lo sentimos, no hay suficiente ${producto.nombre} en stock.\n`);
            return editarCarrito();
        }

        productoStock.cantidad += producto.cantidad;
        productoStock.cantidad -= nuevaCantidad;
        producto.cantidad = nuevaCantidad;

        console.log('Cantidad actualizada correctamente.\n');
        console.log("-------------------------------\n");
        guardarStock();
        menuPrincipal();

    } catch (error) {
        console.error('Error al editar el carrito:', error);
    }
}

async function eliminarProductoCarrito() {
    
    mostrarCarrito();

    try {
        let opcion = await question('Seleccione el producto que desea eliminar: \n');
        let producto = carrito[parseInt(opcion) - 1];

        if (!producto) {
            console.log('Ingrese una opcion válida.\n');
            return eliminarProductoCarrito();
        }

        let productoStock = stockTienda[producto.categoria].find(p => p.nombre === producto.nombre);
        productoStock.cantidad += producto.cantidad;
        carrito = carrito.filter(p => p.nombre !== producto.nombre);

        guardarStock();
        console.log('Producto eliminado del carrito.\n');
        console.log("-------------------------------\n");
        menuPrincipal();

    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
    }
}

async function mostrarCarrito(){

    console.log(`---Productos en el carrito de ${persona.Nombre}---\n`);
    console.log("-------------------------------\n");

    if(carrito.length === 0){
        console.warn(`${persona.Nombre}! tu carrito esta vacio, por favor agrega productos.\n`);
        menuPrincipal();
        return;
    } 

    carrito.forEach((producto, index) => {
        console.log(`${index + 1}. ${producto.nombre} - Precio: $${producto.precioUnitario} - Cantidad: ${producto.cantidad}\n`);
    });

    let total = carrito.reduce((sum, item) => sum + item.precioUnitario * item.cantidad, 0);
    console.log(`Total: $${total}\n`);
    menuPrincipal();
    
}

async function finalizarCompra() {

    mostrarCarrito();
     
    if(carrito.length === 0){
        console.warn(`${persona.Nombre}! tu carrito esta vacio, por favor agrega productos para continuar.\n`);
        menuPrincipal();
        return;
    }

    let total = carrito.reduce((sum, item) => sum + item.precioUnitario * item.cantidad, 0);
    let descuento = 0;

    if(persona.Edad >= 30){
        descuento = 0.15;
    } else if(persona.Edad >= 18 && persona.Edad <= 30){
        descuento = 0.10;
    } else {
        descuento = 0.05;
    }

    let montoDescuento = total * descuento;
    let totalFinal = total - montoDescuento;

    let compra = {
        cliente: persona.Nombre,
        edad: persona.Edad,
        productos: [...carrito],
        subtotal: total,
        descuento: descuento * 100 + "%",
        montoDescuento: montoDescuento,
        totalFinal: totalFinal,
        fecha: new Date().toLocaleString()
    };

    historialDeCompras(compra);

    console.log("-------------------------------\n");
    console.log(`---Resumen de la compra de ${persona.Nombre}---\n`);
    carrito.forEach((producto, index) => {
        console.log(`${index + 1}. ${producto.nombre} - ${producto.cantidad} unidad(es) - Precio: $${producto.precioUnitario} - Subtotal: $${producto.precioUnitario * producto.cantidad}`);
    });

    console.log(`\nSubtotal: $${total}`);
    console.log(`Descuento aplicado (${descuento * 100}%): -$${montoDescuento}`);
    console.log(`Total a pagar: $${totalFinal}\n`);
    console.log("-------------------------------\n");

    guardarStock();
    carrito = [];
    console.log(`Tu compra ha sido finalizada con éxito. ¡Gracias por tu compra!\n`);
    menuPrincipal();

}
async function cerrarPrograma() {
    console.log('Gracias por visitar nuestra tienda en linea. ¡Hasta pronto!');
    console.log("-------------------------------\n");
    rl.close();
}

async function guardarStock() {
    try {
        writeFileSync('stockTienda.json', JSON.stringify(stockTienda, null, 4), 'utf8');
    } catch (error) {
        console.error("Error al guardar el stock:", error);
    }
}

async function historialDeCompras(compra) {
    try {
        let historial = JSON.parse(readFileSync('historialCompras.json', 'utf8'));

        historial.push(compra);

        writeFileSync('historialCompras.json', JSON.stringify(historial, null, 4), 'utf8');
    } catch (error) {
        console.error('Error al guardar en el historial:', error);
    }
}

async function verHistorial() {
    try {
        let historial = JSON.parse(readFileSync('historialCompras.json', 'utf8'));

        if (historial.length === 0) {
            console.log('No hay compras en el historial.\n');
            return;
        }

        console.log('\n --- HISTORIAL DE COMPRAS --- \n');
        historial.forEach((compra, index) => {
            console.log(`Compra #${index + 1} - ${compra.fecha}`);
            console.log(`Cliente: ${compra.cliente} (Edad: ${compra.edad})`);
            console.log("Productos:");

            compra.productos.forEach((producto, i) => {
                console.log(`  ${i + 1}. ${producto.nombre} - ${producto.cantidad} unidad(es) - Precio: $${producto.precioUnitario} - Subtotal: $${producto.precioUnitario * producto.cantidad}`);
            });

            console.log(`Subtotal: $${compra.subtotal}`);
            console.log(`Descuento: ${compra.descuento} (-$${compra.montoDescuento})`);
            console.log(`Total Final: $${compra.totalFinal}\n`);
            console.log("-------------------------------\n");
            menuPrincipal();
        });

    } catch (error) {
        console.error("Error al leer el historial:", error);
    }
}