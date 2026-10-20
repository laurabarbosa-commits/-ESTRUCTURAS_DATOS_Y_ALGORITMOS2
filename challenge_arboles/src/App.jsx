import { useState } from "react";
import Tree from "react-d3-tree";

// ---------- NODO DEL ÁRBOL ----------
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// ---------- ÁRBOL BINARIO DE BÚSQUEDA ----------
class BinaryTree {
  constructor() {
    this.root = null;
  }

  insert(value) {
    const newNode = new TreeNode(value);
    if (!this.root) {
      this.root = newNode;
      return;
    }
    this._insertNode(this.root, newNode);
  }

  _insertNode(node, newNode) {
    if (newNode.value < node.value) {
      if (!node.left) {
        node.left = newNode;
      } else {
        this._insertNode(node.left, newNode);
      }
    } else {
      if (!node.right) {
        node.right = newNode;
      } else {
        this._insertNode(node.right, newNode);
      }
    }
  }

  // Punto 1: Recorridos
  inorder(node = this.root, result = []) {
    if (node) {
      this.inorder(node.left, result);
      result.push(node.value);
      this.inorder(node.right, result);
    }
    return result;
  }

  preorder(node = this.root, result = []) {
    if (node) {
      result.push(node.value);
      this.preorder(node.left, result);
      this.preorder(node.right, result);
    }
    return result;
  }

  postorder(node = this.root, result = []) {
    if (node) {
      this.postorder(node.left, result);
      this.postorder(node.right, result);
      result.push(node.value);
    }
    return result;
  }

  // Punto 2: Buscar si un valor existe
  contains(value, node = this.root) {
    if (!node) return false;
    if (value === node.value) return true;
    if (value < node.value) return this.contains(value, node.left);
    return this.contains(value, node.right);
  }

  // Convierte el árbol al formato que necesita react-d3-tree
  toD3Format(node = this.root) {
    if (!node) return null;

    const result = { name: String(node.value) };
    const children = [];

    if (node.left) children.push(this.toD3Format(node.left));
    if (node.right) children.push(this.toD3Format(node.right));

    if (children.length > 0) {
      result.children = children;
    }

    return result;
  }
}

// ---------- DATOS MOCK ----------
const initialTree = new BinaryTree();
[50, 30, 70, 20, 40, 60, 80].forEach((num) => initialTree.insert(num));

// Imprime los recorridos en consola (punto 1 del challenge)
console.log("Inorder:", initialTree.inorder());
console.log("Preorder:", initialTree.preorder());
console.log("Postorder:", initialTree.postorder());

// ---------- COMPONENTE PRINCIPAL ----------
function App() {
  const [tree] = useState(initialTree);
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = () => {
    const num = Number(searchValue);
    const found = tree.contains(num);
    setSearchResult(found);
  };

  const treeData = tree.toD3Format();

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>🌳 Árbol Binario de Búsqueda</h1>

      <div style={{ marginBottom: "1rem" }}>
        <p>
          <strong>Inorder:</strong> {tree.inorder().join(", ")}
        </p>
        <p>
          <strong>Preorder:</strong> {tree.preorder().join(", ")}
        </p>
        <p>
          <strong>Postorder:</strong> {tree.postorder().join(", ")}
        </p>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <input
          type="number"
          placeholder="Buscar un número"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{ padding: "0.5rem", marginRight: "0.5rem" }}
        />
        <button onClick={handleSearch} style={{ padding: "0.5rem 1rem" }}>
          Buscar
        </button>
        {searchResult !== null && (
          <p>
            {searchResult
              ? `✅ El valor ${searchValue} SÍ está en el árbol`
              : `❌ El valor ${searchValue} NO está en el árbol`}
          </p>
        )}
      </div>

      {/* Punto 3: Visualización con react-d3-tree */}
      <div style={{ width: "100%", height: "500px", border: "1px solid #ccc" }}>
        <Tree
          data={treeData}
          orientation="vertical"
          translate={{ x: 400, y: 50 }}
          pathFunc="step"
        />
      </div>
    </div>
  );
}

export default App;
