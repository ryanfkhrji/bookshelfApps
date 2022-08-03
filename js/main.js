document.addEventListener("DOMContentLoaded", function () {
  const books = [];
  const RENDER_EVENT = "render-book";
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  let bookShelf = JSON.parse(localStorage.getItem("dataBuku"));

  function addBook() {
    const titleBook = document.getElementById("inputBookTitle").value;
    const authorBook = document.getElementById("inputBookAuthor").value;
    const yearBook = document.getElementById("inputBookYear").value;
    const inputBookIsComplete = document.getElementById("inputBookIsComplete").checked;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, titleBook, authorBook, yearBook, inputBookIsComplete, false);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function generateId() {
    return +new Date();
  }

  function generateBookObject(id, title, author, year, isCompleted) {
    return {
      id,
      title,
      author,
      year,
      isCompleted,
    };
  }

  document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    incompleteBookshelfList.innerHTML = "";

    const completeBookshelfList = document.getElementById("completeBookshelfList");
    completeBookshelfList.innerHTML = "";

    for (const bookItem of books) {
      const bookElement = makeBook(bookItem);
      if (!bookItem.isCompleted) {
        incompleteBookshelfList.append(bookElement);
      } else {
        completeBookshelfList.append(bookElement);
      }
    }
  });

  function makeBook(bookObject) {
    const bookTitle = document.createElement("h3");
    bookTitle.innerText = bookObject.title;
    bookTitle.classList.add("move");
    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = "Penulis : " + bookObject.author;
    const bookYear = document.createElement("p");
    bookYear.innerText = "Tahun : " + bookObject.year;

    const bookItem = document.createElement("article");
    bookItem.classList.add("book-item");
    bookItem.append(bookTitle, bookAuthor, bookYear);

    const bookList = document.createElement("div");
    bookList.classList.add("book-list");
    bookList.append(bookItem);
    bookList.setAttribute("id", `book-${bookObject.id}`);
    bookList.style.marginBottom = "5px";
    console.log(bookList);
    // fungsi check, uncheck, delete
    if (bookObject.isCompleted) {
      const bookAction = document.createElement("div");
      bookAction.classList.add("action");

      const undo = document.createElement("button");
      undo.classList.add("selesai");
      const iconUndo = document.createElement("i");
      iconUndo.classList = "bi bi-arrow-counterclockwise";
      undo.innerText = "Belum ";
      undo.style.padding = "5px";
      undo.style.margin = "0px 5px 0px 0px";
      undo.style.cursor = "pointer";

      undo.addEventListener("click", function () {
        undoTaskFromCompleted(bookObject.id);
      });

      const hapus = document.createElement("button");
      hapus.classList.add("hapus");
      const iconHapus = document.createElement("i");
      iconHapus.classList = "bi bi-x-circle-fill";
      hapus.innerText = "Hapus ";
      hapus.style.padding = "5px";
      hapus.style.margin = "0px 5px 0px 0px";
      hapus.style.cursor = "pointer";
      hapus.style.color = "var(--color-third)";
      hapus.style.backgroundColor = "var(--color-second)";

      hapus.addEventListener("click", function () {
        removeTaskFromCompleted(bookObject.id);
      });

      undo.append(iconUndo);
      hapus.append(iconHapus);
      bookAction.append(undo, hapus);
      bookItem.append(bookAction);
      bookList.append(bookItem);
    } else {
      const bookAction = document.createElement("div");
      bookAction.classList.add("action");

      const check = document.createElement("button");
      check.classList.add("selesai");
      const iconSelesai = document.createElement("i");
      iconSelesai.classList = "bi bi-check-circle-fill";
      check.innerText = "Selesai ";
      check.style.padding = "5px";
      check.style.margin = "0px 5px 0px 0px";
      check.style.cursor = "pointer";

      check.addEventListener("click", function () {
        addTaskToCompleted(bookObject.id);
      });

      const hapus = document.createElement("button");
      hapus.classList.add("hapus");
      const iconHapus = document.createElement("i");
      iconHapus.classList = "bi bi-x-circle-fill";
      hapus.innerText = "Hapus ";
      hapus.style.padding = "5px";
      hapus.style.margin = "0px 5px 0px 0px";
      hapus.style.cursor = "pointer";
      hapus.style.color = "var(--color-third)";
      hapus.style.backgroundColor = "var(--color-second)";

      hapus.addEventListener("click", function () {
        removeTaskFromCompleted(bookObject.id);
      });

      check.append(iconSelesai);
      hapus.append(iconHapus);
      bookAction.append(check, hapus);
      bookItem.append(bookAction);
      bookList.append(bookItem);
    }

    //memindahkan rak keharus ke yang sudah dilakukan
    function addTaskToCompleted(bookId) {
      const bookTarget = findBook(bookId);

      if (bookTarget == null) return;

      bookTarget.isCompleted = true;
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
    }

    // mencari todo dengan ID yang sesuai pada array
    function findBook(bookId) {
      for (const bookItem of books) {
        if (bookItem.id === bookId) {
          return bookItem;
        }
      }
      return null;
    }

    return bookList;
  }

  // menghapus list item
  function removeTaskFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    const konfirm = findBookIndex(bookId);
    if (window.confirm("Apakah anda ingin menghapus buku ini?")) {
      books.splice(konfirm, 1);
    } else {
      updateDataToStorage();
    }

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
  function findBookIndex(bookId) {
    for (const index in books) {
      if (books[index].id === bookId) {
        return index;
      }
    }

    return -1;
  }

  //mengundo list item
  function undoTaskFromCompleted(bookId) {
    const bookTarget = bookTodo(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function bookTodo(bookId) {
    for (bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
  }

  //saveData ke localstorage
  const SAVED_EVENT = "saved-todo";
  const STORAGE_KEY = "TODO_APPS";

  function isStorageExist() /* boolean */ {
    if (typeof Storage === undefined) {
      alert("Browser kamu tidak mendukung local storage");
      return false;
    }
    return true;
  }

  function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

  document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });

  //mengambil data dari local storage
  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  //mengambil data dari storage
  if (isStorageExist()) {
    loadDataFromStorage();
  }

  //search buku
  const searchBooks = document.getElementById("searchBook");

  searchBooks.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });

  function searchBook() {
    const inputSearch = document.getElementById("searchBookTitle").value;
    const moveBook = document.querySelectorAll(".move");

    for (move of moveBook) {
      if (inputSearch !== move.innerText) {
        console.log(move.innerText);
        move.parentElement.remove();
      }
    }
  }
});
