import { useState } from "react";

// ---------- TRIE ----------
class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
    this.products = [];
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(name, popularity) {
    let current = this.root;
    const normalized = name.toLowerCase();

    for (const char of normalized) {
      if (!current.children[char]) {
        current.children[char] = new TrieNode();
      }
      current = current.children[char];
    }

    current.isEndOfWord = true;
    current.products.push({ name, popularity });
  }

  // Encuentra el nodo donde termina un prefijo
  _findPrefixNode(prefix) {
    let current = this.root;
    const normalized = prefix.toLowerCase();

    for (const char of normalized) {
      if (!current.children[char]) {
        return null; // el prefijo no existe en el árbol
      }
      current = current.children[char];
    }
    return current;
  }

  // Recorre todo lo que cuelga de un nodo, juntando productos
  _collectProducts(node, result) {
    if (!node) return;

    if (node.isEndOfWord) {
      result.push(...node.products);
    }

    for (const char in node.children) {
      this._collectProducts(node.children[char], result);
    }
  }

  // Todos los productos que empiezan con cierto prefijo
  searchByPrefix(prefix) {
    const startNode = this._findPrefixNode(prefix);
    const result = [];
    this._collectProducts(startNode, result);
    return result;
  }
}

// ---------- MIN-HEAP (para sacar el Top K más popular) ----------
class MinHeap {
  constructor() {
    this.heap = [];
  }

  getParentIndex(i) {
    return Math.floor((i - 1) / 2);
  }
  getLeftIndex(i) {
    return 2 * i + 1;
  }
  getRightIndex(i) {
    return 2 * i + 2;
  }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  push(item) {
    this.heap.push(item);
    this._bubbleUp(this.heap.length - 1);
  }

  _bubbleUp(index) {
    while (index > 0) {
      const parentIndex = this.getParentIndex(index);
      if (this.heap[parentIndex].popularity <= this.heap[index].popularity) break;
      this.swap(index, parentIndex);
      index = parentIndex;
    }
  }

  pop() {
    const top = this.heap[0];
    const last = this.heap.pop();

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._bubbleDown(0);
    }

    return top;
  }

  _bubbleDown(index) {
    const length = this.heap.length;

    while (true) {
      const left = this.getLeftIndex(index);
      const right = this.getRightIndex(index);
      let smallest = index;

      if (left < length && this.heap[left].popularity < this.heap[smallest].popularity) {
        smallest = left;
      }
      if (right < length && this.heap[right].popularity < this.heap[smallest].popularity) {
        smallest = right;
      }
      if (smallest === index) break;

      this.swap(index, smallest);
      index = smallest;
    }
  }

  size() {
    return this.heap.length;
  }
}

// ---------- FUNCIÓN PRINCIPAL: searchTopK ----------
function searchTopK(trie, prefix, k) {
  const matches = trie.searchByPrefix(prefix);

  // Usamos un min-heap de tamaño K: si algo nuevo es más popular
  // que el mínimo del heap, lo reemplazamos. Así, al final, el heap
  // tiene los K más populares.
  const heap = new MinHeap();

  for (const product of matches) {
    if (heap.size() < k) {
      heap.push(product);
    } else if (product.popularity > heap.heap[0].popularity) {
      heap.pop();
      heap.push(product);
    }
  }

  // Sacamos todo del heap y ordenamos de mayor a menor popularidad
  const result = [];
  while (heap.size() > 0) {
    result.push(heap.pop());
  }

  return result.reverse(); // el pop del min-heap da ascendente, lo invertimos
}

// ---------- DATOS MOCK ----------
function buildTrie() {
  const trie = new Trie();
  trie.insert("air max", 90);
  trie.insert("air force", 95);
  trie.insert("air jordan", 85);
  trie.insert("adidas boost", 80);
  trie.insert("air zoom", 70);
  trie.insert("air presto", 60);
  return trie;
}

const trie = buildTrie();

// ---------- COMPONENTE PRINCIPAL ----------
function App() {
  const [query, setQuery] = useState("");
  const [k, setK] = useState(2);
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }
    const topResults = searchTopK(trie, query, Number(k));
    setResults(topResults);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <h1>🔍 Buscador Inteligente</h1>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Buscar producto (ej: air)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <input
          type="number"
          min="1"
          value={k}
          onChange={(e) => setK(e.target.value)}
          style={{ width: "60px", padding: "0.5rem" }}
          title="Top K resultados"
        />
        <button onClick={handleSearch} style={{ padding: "0.5rem 1rem" }}>
          Buscar
        </button>
      </div>

      <p style={{ color: "#888" }}>Mostrando el Top {k} más popular que empieza con "{query}"</p>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {results.map((product, index) => (
          <li
            key={index}
            style={{
              padding: "0.8rem",
              marginBottom: "0.5rem",
              backgroundColor: "#f4f4f4",
              borderRadius: "6px",
              borderLeft: "4px solid #3b5bdb",
            }}
          >
            <strong>{product.name}</strong> — popularidad: {product.popularity}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;