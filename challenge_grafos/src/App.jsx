import { useState } from "react";

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
    this.edges.push({ source: person.id, target: `city-${cityName}` });
    return person;
  }

  getPeopleInCity(cityName) {
    return this.people.filter((p) => p.city === cityName);
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

function buildPositions(graph) {
  const positions = {};
  const width = 800;
  const citySpacing = width / (graph.cities.length + 1);

  // Ciudades en fila de arriba
  graph.cities.forEach((city, i) => {
    positions[city.id] = { x: citySpacing * (i + 1), y: 100 };
  });

  // Personas en fila de abajo, agrupadas bajo su ciudad
  const peopleByCity = {};
  graph.people.forEach((p) => {
    if (!peopleByCity[p.city]) peopleByCity[p.city] = [];
    peopleByCity[p.city].push(p);
  });

  graph.cities.forEach((city, cityIndex) => {
    const peopleHere = peopleByCity[city.name] || [];
    const baseX = citySpacing * (cityIndex + 1);
    peopleHere.forEach((person, i) => {
      const offset = (i - (peopleHere.length - 1) / 2) * 90;
      positions[person.id] = { x: baseX + offset, y: 320 };
    });
  });

  return positions;
}

function GraphView({ graph }) {
  const positions = buildPositions(graph);

  return (
    <svg width="800" height="420" style={{ border: "1px solid #ccc", backgroundColor: "#1e1e2f" }}>
      {/* Líneas (edges) */}
      {graph.edges.map((edge, i) => {
        const from = positions[edge.source];
        const to = positions[edge.target];
        if (!from || !to) return null;
        return (
          <line
            key={i}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="#888"
            strokeWidth="2"
          />
        );
      })}

      {/* Nodos de ciudades */}
      {graph.cities.map((city) => {
        const pos = positions[city.id];
        return (
          <g key={city.id}>
            <circle cx={pos.x} cy={pos.y} r="28" fill="#3b5bdb" />
            <text x={pos.x} y={pos.y + 5} textAnchor="middle" fill="white" fontSize="13">
              {city.name}
            </text>
          </g>
        );
      })}

      {/* Nodos de personas */}
      {graph.people.map((person) => {
        const pos = positions[person.id];
        return (
          <g key={person.id}>
            <circle cx={pos.x} cy={pos.y} r="24" fill="#51cf66" />
            <text x={pos.x} y={pos.y} textAnchor="middle" fill="white" fontSize="11">
              {person.name}
            </text>
            <text x={pos.x} y={pos.y + 14} textAnchor="middle" fill="white" fontSize="10">
              {person.age}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function App() {
  const [selectedCity, setSelectedCity] = useState("Bogotá");
  const peopleInCity = graph.getPeopleInCity(selectedCity);

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

      <GraphView graph={graph} />
    </div>
  );
}

export default App;