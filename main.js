const FUNCIONALIDADES = {
    "borrar": 0,
    "multiplicar": 1,
    "sumar": 2,
    "igual": 3,
    "division": 4,
    "resta": 5,
    "numero": 6,
    "punto": 7
};


const MAX_CARACTERES_EN_PANTALLA = 16;


class Pantalla {
    constructor () {
        this.pantalla = document.querySelector('.pantalla');
    }
    limpiar () {
        this.pantalla.textContent = "";
    }
    imprimir (texto) {
        this.pantalla.textContent += texto;
        this.pantalla.textContent = this.pantalla.textContent.slice(0, MAX_CARACTERES_EN_PANTALLA); 
    }
};


class Memoria {
    constructor () {
        this.hayNum1 = false;
        this.hayNum2 = false;
        this.digitosDecimalesNum1 = 0;
        this.digitosDecimalesNum2 = 0;
        this.num1 = 0;
        this.num2 = 0;
        this.operacion = -1;
    }
    asginarNum1 (digito, esDecimal) {
        this.hayNum1 = true;
        if (!esDecimal) {
            this.num1 *= 10;
            this.num1 += digito;
        } else {
            this.num1 = this.num1 + digito / Math.pow(10, this.digitosDecimalesNum1 + 1);
            this.digitosDecimalesNum1++;
        }
    }
    obtenerNum1 () {
        return this.num1;
    }
    asginarNum2 (digito, esDecimal) {
        this.hayNum2 = true;
        if (!esDecimal) {
            this.num2 *= 10;
            this.num2 += digito;
        } else {
            this.num2 = this.num2 + digito / Math.pow(10, this.digitosDecimalesNum2 + 1);
            this.digitosDecimalesNum2++;
        }
    }
    obtenerNum2 () {
        return this.num2;
    }
    existeNum1 () {
        return this.hayNum1;
    }
    existeNum2 () {
        return this.hayNum2;
    }
    reiniciar () {
        this.hayNum1 = false;
        this.hayNum2 = false;
        this.num1 = 0;
        this.digitosDecimalesNum1 = 0;
        this.digitosDecimalesNum2 = 0;
        this.num2 = 0;
        this.operacion = -1;
    }
    asignarOperacion (operacion) {
        this.operacion = operacion;
    }
    existeOperacion () {
        return this.operacion != -1;
    }
    obtenerOperador() {
        return this.operacion;
    }
}


class Calculadora {
    constructor () {
        this.hayError = false;
        this.hayResultado = false;
        this.esDigitoDecimal = false;
        this.memoria = new Memoria();
        this.pantalla = new Pantalla();
        this.pantalla.limpiar();
        for (let boton of document.querySelector('.botones').children) {
            boton.removeEventListener('click',this.operar);
            boton.addEventListener('click', e => this.operar(e));
        }
    }
    calcular () {
        let resultado;
        try {
            this.hayResultado = true;
            this.hayError = false; 
            this.esDigitoDecimal = false;
            if (this.memoria.existeOperacion() && !this.memoria.existeNum2())
                throw new Error();
            else if (!this.memoria.existeOperacion())
                resultado = this.memoria.obtenerNum1();
            switch (this.memoria.obtenerOperador()) {
                case FUNCIONALIDADES["sumar"]:
                    resultado = this.memoria.obtenerNum1() + this.memoria.obtenerNum2();
                    break;
                case FUNCIONALIDADES["multiplicar"]:
                    resultado = this.memoria.obtenerNum1() * this.memoria.obtenerNum2();
                    break;
                case FUNCIONALIDADES["resta"]:
                    resultado = this.memoria.obtenerNum1() - this.memoria.obtenerNum2();
                    break;
                case FUNCIONALIDADES["division"]:
                    if (this.memoria.obtenerNum2() == 0) 
                        throw new Error();
                    resultado = this.memoria.obtenerNum1() / this.memoria.obtenerNum2();
                    break;
            }
            this.pantalla.limpiar();
            this.memoria.reiniciar();
            this.memoria.asginarNum1(resultado, false);
            this.pantalla.imprimir(resultado.toString());
        } catch (e) {
            this.hayError = true;
            this.pantalla.limpiar();
            this.memoria.reiniciar();
            this.pantalla.imprimir(e);
        }
    }
    operar ({ target }) {
        switch (parseInt(target.id)) {
            case FUNCIONALIDADES["numero"]:
                if (this.hayResultado || this.hayError) {
                    this.hayResultado = false;
                    this.memoria.reiniciar();
                    this.pantalla.limpiar();
                }
                if (!this.memoria.existeOperacion()) 
                    this.memoria.asginarNum1(parseInt(target.textContent), this.esDigitoDecimal);
                else 
                    this.memoria.asginarNum2(parseInt(target.textContent), this.esDigitoDecimal);
                this.pantalla.imprimir(target.textContent);
                console.log(this.memoria);
                this.hayError = false; 
                break;
            case FUNCIONALIDADES["borrar"]:
                this.memoria.reiniciar();
                this.pantalla.limpiar();
                this.hayResultado = false;
                this.esDigitoDecimal = false;
                this.hayError = false; 
                break;
            case FUNCIONALIDADES["igual"]:
                this.calcular();
                break;
            case FUNCIONALIDADES["punto"]:
                if (this.hayResultado || this.hayError) {
                    this.hayResultado = false;
                    this.pantalla.limpiar();
                    this.memoria.reiniciar();
                }
                if (!this.esDigitoDecimal)
                    this.pantalla.imprimir('.');
                this.esDigitoDecimal = true;
                this.hayError = false; 
                break;
            default:
                if (this.memoria.existeOperacion())
                    this.calcular();
                this.hayResultado = false;
                this.esDigitoDecimal = false;
                this.memoria.asignarOperacion(parseInt(target.id));
                if (!this.hayError)    
                    this.pantalla.imprimir(` ${target.textContent} `);
        }
    }
};


let calculadora = new Calculadora();

