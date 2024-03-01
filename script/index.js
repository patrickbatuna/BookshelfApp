const RENDER_EVENT = "render_event";
const localStorageKey = "LOCAL_STORAGE_KEY";
const modeKey = "MODE_KEY";
const booksArray = [];

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Your browser does not support local storage!");
    return false;
  }
  return true;
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isRead) {
  return { id, title, author, year, isRead };
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(booksArray);
    localStorage.setItem(localStorageKey, parsed);
    console.log(booksArray);
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(localStorageKey);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      booksArray.push(book);
    }
  }

  const serializedModeData = localStorage.getItem(modeKey);
  const modeData = JSON.parse(serializedModeData);

  if (modeData !== null) {
    darkMode(modeData);
  } else {
    darkMode(false);
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function darkMode(mode) {
  const stringMode = JSON.stringify(mode);
  localStorage.setItem(modeKey, stringMode);

  if (mode) {
    document
      .getElementById("css")
      .setAttribute("href", "styles/dark-styles.css");
  } else {
    document
      .getElementById("css")
      .setAttribute("href", "styles/light-styles.css");
  }
}

function addBook() {
  const titleField = document.getElementById("titleField");
  const authorField = document.getElementById("authorField");
  const yearField = document.getElementById("yearField");
  const isReadField = document.getElementById("isReadField");

  if (!titleField.value || !authorField.value || !yearField.value) {
    window.alert("Data buku tidak lengkap!");
    titleField.value = "";
    authorField.value = "";
    yearField.value = "";
    isReadField.checked = false;
    return;
  }

  const id = generateId();
  const title = titleField.value;
  const author = authorField.value;
  const year = yearField.value;
  const isRead = isReadField.checked;

  const bookObject = generateBookObject(id, title, author, year, isRead);
  booksArray.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  titleField.value = "";
  authorField.value = "";
  yearField.value = "";
  isReadField.checked = false;
}

function findBookIndex(id) {
  for (const i in booksArray) {
    if (booksArray[i].id === id) {
      return i;
    }
  }
  return -1;
}

function removeBook(id) {
  const bookTitle = document.getElementById("bookTitle");
  const { title } = findBookObject(id);
  bookTitle.innerText = title;

  const popup = document.getElementById("popupContainer");
  const cancelButton = document.getElementById("cancelButton");
  const container = document.getElementById("popupButtonContainer");
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.innerText = "Delete";
  container.append(deleteButton);

  deleteButton.addEventListener("click", function () {
    const bookIndex = findBookIndex(id);
    if (bookIndex === -1) {
      return;
    }
    booksArray.splice(bookIndex, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    popup.classList.add("hidden");
    popup.classList.remove("popup-container");
    saveData();
    deleteButton.remove();
  });

  cancelButton.addEventListener("click", function () {
    popup.classList.add("hidden");
    popup.classList.remove("popup-container");
    document.removeEventListener;
    deleteButton.remove();
  });

  popup.classList.add("popup-container");
  popup.classList.remove("hidden");
}

function findBookObject(id) {
  for (const i in booksArray) {
    if (booksArray[i].id === id) {
      return booksArray[i];
    }
  }
  return null;
}

function addDoneReading(bookId) {
  bookTarget = findBookObject(bookId);
  if (bookTarget == null) {
    return;
  }
  bookTarget.isRead = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addNotDoneReading(bookId) {
  bookTarget = findBookObject(bookId);
  if (bookTarget == null) {
    return;
  }
  bookTarget.isRead = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function editBook(bookObject) {
  const newTitleField = document.getElementById("newTitleField");
  const newAuthorField = document.getElementById("newAuthorField");
  const newYearField = document.getElementById("newYearField");
  const newIsReadField = document.getElementById("newIsReadField");
  const cancelBookButton = document.getElementById("cancelBookButton");
  const editBookButton = document.createElement("button");
  editBookButton.setAttribute("type", "submit");
  editBookButton.classList.add("inputBook");
  editBookButton.innerText = "Done";
  const editForm = document.getElementById("editForm");
  editForm.insertBefore(editBookButton, cancelBookButton);

  newTitleField.value = bookObject.title;
  newAuthorField.value = bookObject.author;
  newYearField.value = bookObject.year;
  newIsReadField.checked = bookObject.isRead;

  cancelBookButton.addEventListener("click", function () {
    editContainer.classList.add("hidden");
    editContainer.classList.remove("edit-container");
    editBookButton.remove();
  });

  editBookButton.addEventListener("click", function (event) {
    event.preventDefault();

    if (newTitleField.value && newAuthorField.value && newYearField.value) {
      currentBookIndex = findBookIndex(bookObject.id);
      currentBookId = bookObject.id;
      const newTitle = newTitleField.value;
      const newAuthor = newAuthorField.value;
      const newYear = newYearField.value;
      const newIsRead = newIsReadField.checked;

      const newBookObject = generateBookObject(
        currentBookId,
        newTitle,
        newAuthor,
        newYear,
        newIsRead
      );

      booksArray.splice(currentBookIndex, 1, newBookObject);

      saveData();
      document.dispatchEvent(new Event(RENDER_EVENT));
      editContainer.classList.add("hidden");
      editContainer.classList.remove("edit-container");
      editBookButton.remove();
    } else {
      window.alert("Data buku tidak lengkap!");
    }
  });
  const editContainer = document.getElementById("editContainer");
  editContainer.classList.add("edit-container");
  editContainer.classList.remove("hidden");
}

function makeBookElement(bookObject) {
  const book = document.createElement("div");
  book.classList.add("book");

  const titleEditContainer = document.createElement("div");
  titleEditContainer.classList.add("title-edit-container");
  const title = document.createElement("h2");
  title.innerText = bookObject.title;

  const editButton = document.createElement("i");
  editButton.classList.add("fa");
  editButton.classList.add("fa-edit");
  editButton.addEventListener("click", function () {
    editBook(bookObject);
    document.getElementById("newTitleField").focus();
  });

  titleEditContainer.append(title, editButton);

  const author = document.createElement("p");
  author.innerText = `Author : ${bookObject.author}`;
  const year = document.createElement("p");
  year.innerText = `Year : ${bookObject.year}`;

  const doneDeleteContainer = document.createElement("div");
  doneDeleteContainer.classList.add("done-delete-container");

  const greenButton = document.createElement("button");
  greenButton.classList.add("greenButton");
  if (!bookObject.isRead) {
    greenButton.innerText = "Done reading";
    greenButton.addEventListener("click", function () {
      addDoneReading(bookObject.id);
    });
    doneDeleteContainer.append(greenButton);
  } else {
    greenButton.innerText = "Not done reading";
    greenButton.addEventListener("click", function () {
      addNotDoneReading(bookObject.id);
    });
    doneDeleteContainer.append(greenButton);
  }

  const redButton = document.createElement("button");
  redButton.classList.add("redButton");
  redButton.innerText = "Delete item";
  redButton.addEventListener("click", function () {
    removeBook(bookObject.id);
  });
  doneDeleteContainer.appendChild(redButton);

  book.append(titleEditContainer, author, year, doneDeleteContainer);
  return book;
}

function searchBook() {
  const searchField = document.getElementById("searchField");
  if (!searchField.value) {
    document.dispatchEvent(new Event(RENDER_EVENT));
  } else {
    const readingBookContainer = document.getElementById(
      "readingBookContainer"
    );
    const readBookContainer = document.getElementById("readBookContainer");
    readingBookContainer.innerHTML = "";
    readBookContainer.innerHTML = "";
    for (const book of booksArray) {
      if (book.title.toUpperCase().includes(searchField.value.toUpperCase())) {
        const bookElement = makeBookElement(book);
        if (!book.isRead) {
          readingBookContainer.append(bookElement);
        } else {
          readBookContainer.append(bookElement);
        }
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("searchButton");
  searchButton.addEventListener("click", function (event) {
    event.preventDefault();
    searchBook();
  });

  const submitBook = document.getElementById("submitBook");
  submitBook.addEventListener("click", function (event) {
    event.preventDefault();
    addBook();
  });

  const darkModeButton = document.getElementById("darkModeButton");
  darkModeButton.addEventListener("click", function (event) {
    event.preventDefault();
    darkMode(true);
  });

  const lightModeButton = document.getElementById("lightModeButton");
  lightModeButton.addEventListener("click", function (event) {
    event.preventDefault();
    darkMode(false);
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const readingBookContainer = document.getElementById("readingBookContainer");
  const readBookContainer = document.getElementById("readBookContainer");
  readingBookContainer.innerHTML = "";
  readBookContainer.innerHTML = "";

  for (const book of booksArray) {
    const bookElement = makeBookElement(book);
    if (!book.isRead) {
      readingBookContainer.append(bookElement);
    } else readBookContainer.append(bookElement);
  }
});
