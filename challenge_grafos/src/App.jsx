import { useState } from "react";
import { Graph as D3Graph } from "react-d3-graph";


class PersonNode {
  constructor(name, age, city) {
    this.id = `person-${name}`;
    this.name = name;
    this.age = age;
    this.city = city;
  }
}

class CityNode {
  constructor(name) {
    this.id = `city-${name}`;
    this.name = name;
  }
}

class Graph {
  constructor() {
    this.people = [];
    this.cities = [];
    this.edges = [];
  }

  addCity(name) {
    const city = new CityNode(name);
    this.cities.push(city);
    return city;
  }

  addPerson(name, age, cityName) {
    const person = new PersonNode(name, age, cityName);
    this.people.push(person);

    this.edges.push({
      source: person.id,
      target: `city-${cityName}`,
    });

    return person;
  }


  getPeopleInCity(cityName) {
    return this.people.filter((p) => p.city === cityName);
  }

  toD3Format() {
    const nodes = [
      ...this.cities.map((c) => ({ id: c.id, label: c.name, color: "#3b5bdb" })),
      ...this.people.map((p) => ({ id: p.id, label: `${p.name} (${p.age})`, color: "#51cf66" })),
    ];

    const links = this.edges.map((e) => ({ source: e.source, target: e.target }));

    return { nodes, links };
  }
}

function buildGraph() {
  const graph = new Graph();

  graph.addCity("Bogotá");
  graph.addCity("Medellín");
  graph.addCity("Cali");

  graph.addPerson("Laura", 24, "Bogotá");
  graph.addPerson("Carlos", 29, "Bogotá");
  graph.addPerson("Mariana", 22, "Medellín");
  graph.addPerson("Andrés", 31, "Cali");
  graph.addPerson("Sofía", 27, "Medellín");

  return graph;
}

const graph = buildGraph();


console.log("Personas en Bogotá:", graph.getPeopleInCity("Bogotá"));

const graphConfig = {
  nodeHighlightBehavior: true,
  directed: false,
  height: 500,
  width: 800,
  node: {
    color: "#51cf66",
    size: 400,
    highlightStrokeColor: "blue",
    labelProperty: "label",
    fontSize: 12,
  },
  link: {
    highlightColor: "lightblue",
  },
};

function App() {
  const [selectedCity, setSelectedCity] = useState("Bogotá");

  const peopleInCity = graph.getPeopleInCity(selectedCity);
  const graphData = graph.toD3Format();

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>🌐 Grafo de Amigos y Ciudades</h1>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ marginRight: "0.5rem" }}>Ver personas en:</label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          style={{ padding: "0.4rem" }}
        >
          {graph.cities.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <ul>
          {peopleInCity.map((p) => (
            <li key={p.id}>
              {p.name} — {p.age} años
            </li>
          ))}
        </ul>
      </div>

      <div style={{ border: "1px solid #ccc" }}>
        <D3Graph id="friends-cities-graph" data={graphData} config={graphConfig} />
      </div>
    </div>
  );
}

export default App;
