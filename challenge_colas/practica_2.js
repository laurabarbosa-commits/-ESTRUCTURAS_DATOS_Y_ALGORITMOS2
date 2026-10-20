class Person {
    constructor(name, withdrawalAmount, arrivalDate) {
        this.name = name;
        this.withdrawalAmount = withdrawalAmount;
        this.arrivalDate = new Date();
    }
}

class Queue {
    constructor() {
        this.people = [];
    }
    enqueue(person) {
        this.people.push(person);
    }

    dequeue() {
        return this.people.shift();
    }

    print() {
        this.people.forEach(person => {
            console.log(`Nombre: ${person.name}, Monto de retiro: ${person.withdrawalAmount}, Fecha de llegada: ${person.arrivalDate}`);
        });
    }
}

const queue = new Queue();

queue.enqueue(new Person("Ana", 100000));
queue.enqueue(new Person("Luis", 250000));
queue.enqueue(new Person("Sofía", 50000));

console.log("--- Cola inicial ---");
queue.print();