// Book class: Represents a book
class Book{
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handles UI task (User Interface)
class UI {
    static displayBook(){
        const books = store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `
        list.appendChild(row);
    }

    static deleteBook(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = ` alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        
        // Vanish is 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000)
    }

    static clearFields() {
        document.querySelector('#title').value = "";
        document.querySelector('#author').value = "";
        document.querySelector('#isbn').value = "";
    }
}

// Note:: As local storage has key-value pair.
// so first we need to strigify it to store into local storage and for using this, we need to parse it.

// Storage class: Handles storage
class store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) 
            books=[];
        else 
            books = JSON.parse(localStorage.getItem('books'));
        
        return books;
    }

    static addBook(book) {
        const books = this.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = store.getBooks();
        books.forEach((book, index) => {
            if(book.isbn === isbn)
                books.splice(index, 1);
        })
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Add a book
document.querySelector('#book-form').addEventListener('submit', (e) => {

    // prevent form from submitting
    e.preventDefault();

    // Get Form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate
    if(title === '' || author ==='' || isbn === '')
        UI.showAlert("Please fill in all fields", "danger");
    else {
        // Instantiate book
        const book = new Book(title, author, isbn);

        // Add Book to UI
        UI.addBookToList(book);

        // Add Book to store
        store.addBook(book);

        // show success message
        UI.showAlert("Book Added", "success");

        // Clear fields
        UI.clearFields();
    }
})

// Event: Display books
document.addEventListener('DOMContentLoaded', UI.displayBook)

// Event: Remove a book
document.querySelector('#book-list').addEventListener('click', (e) =>{ 
    
    // Remove book from UI
    UI.deleteBook(e.target);

    // Remove book from store
    store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    UI.showAlert("Book Removed", "info");
});
