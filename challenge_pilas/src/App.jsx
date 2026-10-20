import { useState } from "react";
class Book {
    constructor(name, isbn, author, editorial) {
        this.name = name;
        this.isbn = isbn;
        this.author = author;
        this.editorial = editorial;
    }
}

class Stack {
    constructor() {
        this.books = [];
    }
    
    push(book) {
        this.books.push(book);
    }

    pop() {
        if (this.books.length === 0) {
            console.log("La pila está vacía");
            return null;
        }
        return this.books.pop();
    }

    print() {
        this.books.forEach(book => {
            console.log(`Nombre: ${book.name}, ISBN: ${book.isbn}, Autor: ${book.author}, Editorial: ${book.editorial}`);
        });
    }

}

const initialStack = new Stack();
initialStack.push(new Book("El arte de no amargarse la vida", "978-0000000000", "Rafael Santandreu", "Libreria Nacional"));
initialStack.push(new Book("Sentir", "978-0000000001", "Miriam Tirado", "Grijalbo"));
initialStack.push(new Book("La Felicidad", "978-0000000002", "Grabiel Rolon", "Panamericana"));



function App() {
    const [books, setBooks] = useState(initialStack.books);
    const [formData, setFormData] = useState({
        name: "",
        isbn: "",
        author: "",
        editorial: ""
    });

    return (
        <div>
            <h1>Pilas de Libros</h1>
            <input
                type="text"
                placeholder="Nombre del libro"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
                type="text"
                placeholder="ISBN"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
            />
            <input
                type="text"
                placeholder="Autor"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            />
            <input
                type="text"
                placeholder="Editorial"
                value={formData.editorial}
                onChange={(e) => setFormData({ ...formData, editorial: e.target.value })}
            />
            <button onClick={() => {
                const newBook = new Book(formData.name, formData.isbn, formData.author, formData.editorial);
                initialStack.push(newBook);
                setBooks([...initialStack.books]);
                setFormData({ name: "", isbn: "", author: "", editorial: "" });
            }}>
                Agregar Libro
            </button>

            <ul>
                {books.map((book, index) => (
                    <li key={index}>
                        <strong>Nombre:</strong> {book.name}, <strong>ISBN:</strong> {book.isbn}, <strong>Autor:</strong> {book.author}, <strong>Editorial:</strong> {book.editorial}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;