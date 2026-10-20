import { useState } from "react";
import "./App.css";

class Person {
    constructor(name, withdrawalAmount, arrivalDate) {
        this.name = name;
        this.withdrawalAmount = withdrawalAmount;
        this.arrivalDate = new Date(Date.now()- Math.random() * 24 * 60 * 60 * 1000);
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

function App() {
    const [people, setPeople] = useState(queue.people);
    const [formData, setFormData] = useState({
        name: "",
        withdrawalAmount: ""
    });

    const sortedPeople = [...people].sort((a, b) => a.arrivalDate - b.arrivalDate);

    return (
      <div className="container">
          <div className="form-container">
              <h1>Cola de Personas</h1>
              <div className="form-group">
                  <label>Nombre</label>
                  <input
                      type="text"
                      placeholder="Ingrese el nombre"
                      value={formData.name}
                      onChange={(e) =>
                          setFormData({
                              ...formData,
                              name: e.target.value
                          })
                      }
                  />
                </div>

              <div className="form-group">
                  <label>Monto a retirar</label>
                  <input
                      type="number"
                      placeholder="Ej. 200000"
                      value={formData.withdrawalAmount}
                      onChange={(e) =>
                          setFormData({
                              ...formData,
                              withdrawalAmount: e.target.value
                          })
                      }
                  />
              </div>

              <button
                  onClick={() => {
                      const newPerson = new Person(
                          formData.name,
                          formData.withdrawalAmount
                      );

                      queue.enqueue(newPerson);

                      setPeople([...queue.people]);

                      setFormData({
                          name: "",
                          withdrawalAmount: ""
                      });
                  }}
              >
                  Agregar a la cola
              </button>

              <h2 align="center">
                  Cola de personas - Cantidad: {people.length}
              </h2>
              <p>
                <ul>
                  {[...people]

                  .sort((a, b) => a.arrivalDate - b.arrivalDate)
                  .map((person, index) => (
                    <li key={index}>
                      Nombre: {person.name} -
                      Monto a retirar: {person.withdrawalAmount} -
                      Fecha de llegada: {person.arrivalDate.toLocaleString()}
                    </li>
                  ))}
                </ul>
              </p>

              <h2 align="center">Persona al frente de la cola:</h2>
              <p>
                {sortedPeople[0]?.name ? `Nombre: ${sortedPeople[0].name} - Monto a retirar: ${sortedPeople[0].withdrawalAmount} - Fecha de llegada: ${sortedPeople[0].arrivalDate.toLocaleString()}` : "La cola está vacía."}
              </p>
          </div>
      </div>
  );
}

export default App;