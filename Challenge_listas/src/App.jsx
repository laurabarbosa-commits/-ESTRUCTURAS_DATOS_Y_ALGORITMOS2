import { useState } from "react";

// Lista Simple
class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    append(value) {
        const newNode = new Node(value);
        if (!this.head) {
            this.head = newNode;
        } else {
            this.tail.next = newNode;
        }
        this.tail = newNode;
        this.length++;

    }
    size() {
        return this.length;
    }
}

// Lista Doble
class DoubleNode {
    constructor(value) {
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}

class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    append(value) {
        const newNode = new DoubleNode(value);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
        this.length++;
    }

    size() {
        return this.length;
    }
}

// DATOS DE PRUEBA
const songs = new LinkedList();
songs.append("La niña de tus ojos - Daniel Calveti");
songs.append("A La Niña Que Fui - Kany García");
songs.append("Hotel California - Eagles");
songs.append("Billie Jean - Michael Jackson");

const history = new DoublyLinkedList();
history.append("google.com");
history.append("github.com");
history.append("uao.edu.co");
history.append("youtube.com");
history.append("linkedin.com");

//PAGINA 1 - LISTA SIMPLE
function SongsList() {
    const [current,setCurrent] = useState(songs.head);
    const next = () => {
        if(current.next)
            setCurrent(current.next);
        };

    return (
        <div style={{textAlign:"center", padding:"2rem"}}>
            <h2>🎵 Reproductor de canciones</h2>
            <p style={{fontSize: "1.3rem", margin:"1.5rem 0"}}>
                {current ? current.value : "No hay canciones en la lista"}
            </p>
            <button onClick={next} disabled={!current?.next}>
                Siguiente
            </button>
            <p style={{marginTop:"1rem", color:"#888"}}>Total de Canciones en la lista: {songs.size()}</p>
        </div>
    );
}

//PAGINA 2 - LISTA DOBLE
function BrowserPages() {
    const [current,setCurrent] = useState(history.head);
    const back = () => {
        if(current.prev)
            setCurrent(current.prev);
    };
    const forward = () => {
        if(current.next)
            setCurrent(current.next);
    };

    return (
        <div style={{textAlign:"center", padding:"2rem"}}>
            <h2>🌐 Historial del navegador</h2>
            <p style={{fontSize: "1.3rem", margin:"1.5rem 0"}}>{current.value}</p>
            <button onClick={back} disabled={!current.prev} style={{ marginRight: "0.5rem" }}>
        ◀ Atrás
        </button>
        <button onClick={forward} disabled={!current.next}>
            Adelante ▶
        </button>
        <p style={{ marginTop: "1rem", color: "#888" }}>
            Total de páginas: {history.size()}
        </p>
        </div>
    );
}

// PAGINA PRINCIPAL
function App() {
    const [page, setPage] = useState("songs");
    
    return (
        <div>
            <nav style={{ textAlign: "center", padding: "1rem", borderBottom: "1px solid #ddd" }}>
                <button onClick={() => setPage("songs")} style={{ marginRight: "0.5rem" }}>
                Canciones (Linked List)
                </button>
                <button onClick={() => setPage("browser")}>
                Navegador (Doubly Linked List)
                </button>
            </nav>
            {page === "songs" ? <SongsList /> : <BrowserPages />}
        </div>
    );
}

export default App;