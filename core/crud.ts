import fs from "fs"; // ES6
import { v4 as uuid } from 'uuid';


const DB_FILE_PATH = "./core/db"
console.log("[CRUD]");

interface Todo {
    id: string;
    date: string;
    content: string;
    done: boolean;
}


function create(content: string): Todo {
    const todo = {
        id: uuid(),
        date: new Date().toISOString(),
        content: content,
        done: false
    };

    const todos: Array<Todo> = [
        ...read(),
        todo,
    ];

    console.log(todo)
    // salvar o content no sistema
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
        todos,
        dogs: [],
    }, null, 2));
    return todo;
}

function read(): Array<Todo> {
    const dbString = fs.readFileSync(DB_FILE_PATH, 'utf-8')
    const db = JSON.parse(dbString || "{}");
    if (!db.todos) { // Fail Fast Validations
        return [];
    }
    return db.todos;
}

function update(id: string, partialTodo: Partial<Todo>) {
    let updatedTodo;
    const todos = read();
    todos.forEach((currentTodo) => {
        const isToUpdate = currentTodo.id === id;
        if (isToUpdate) {
            Object.assign(currentTodo, partialTodo)
        }
    });

    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
        todos,
    }, null, 4));

    if (!updatedTodo) {
        throw new Error("Please, provide another ID!")
    }
    return updatedTodo;
}

function CLEAR_DB() {
    fs.writeFileSync(DB_FILE_PATH, "")
}

function updateContentById(id: string, content: string): Todo {
    return update(id, {
        content,
    })
}


CLEAR_DB()

create("Primeira TODO")
const segundaTodo = create("Segunda TODO")
updateContentById(segundaTodo.id, "Atualizada!")
console.log(read());


