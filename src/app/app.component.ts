import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    todo_entries: Todo[];

    constructor() {
        const data = localStorage.getItem("todo_entries");
        if (data === null) {
            this.todo_entries = [];
        } else {
            this.todo_entries = <Todo[]> JSON.parse(data);
        }
    }
    
    save_todo_entries() {
        localStorage.setItem("todo_entries", JSON.stringify(this.todo_entries));
    }

    ngOnInit(): void {
        // Add Todo Form
        const todo_add_description: HTMLInputElement = <HTMLInputElement> document.getElementById("todo_add_description");
        const todo_add_deadline: HTMLInputElement = <HTMLInputElement> document.getElementById("todo_add_deadline");
        const todo_add_submit: HTMLElement = <HTMLElement> document.getElementById("todo_add_submit");
        console.log("todo_add_submit", todo_add_submit)

        todo_add_submit.addEventListener("click", () => {
            if (todo_add_description.value === "") {
                todo_add_description.style.border = "1px solid red";
            } else if (todo_add_deadline.value === "") {
                todo_add_deadline.style.border = "1px solid red";
            } else {
                todo_add_description.style.border = "";
                todo_add_deadline.style.border = "";
    
                this.todo_entries.push( new Todo(todo_add_description.value, todo_add_deadline.value) );
                this.save_todo_entries();
                this.refresh_todo_list();
            }
        });

        this.refresh_todo_list();
    }

    refresh_todo_list() {
        const todo_list: HTMLElement = <HTMLElement> document.getElementById("todo_list");
        todo_list.innerHTML = '';
        for(let i=0; i<this.todo_entries.length; i++) {
            const todo = this.todo_entries[i];

            const chip_container = document.createElement("div");
            chip_container.className = "col-12 col-md-4 col-lg-2";

            const chip = document.createElement("div");
            chip.className = "todo-chip";
            chip_container.append(chip);
            if (todo.status === 1) {
                chip.classList.add("done");
            } else {
                chip.addEventListener("click", () => {
                    chip.classList.add("done");
                    todo.status = 1;
                    this.save_todo_entries();
                });
            }


            // description
            const col_description = document.createElement("div");
            col_description.className = "col";
            col_description.innerText = todo.description;
            chip.append(col_description);

            // delete button
            const delete_button = document.createElement("button");
            delete_button.className = "todo-chip-delete";
            delete_button.innerHTML = "&times;";
            chip.append(delete_button);

            const todo_index = i;
            delete_button.addEventListener("click", () => {
                console.log("todo_index", todo_index)
                this.todo_entries.splice(todo_index, 1);

                this.save_todo_entries();
                this.refresh_todo_list();
            });


            todo_list.append(chip_container);
        }
    }
}


class Todo {
    description: string;
    status: number; // 0 = offen; 1 = erledigt
    deadlineDate: string;

    constructor(description: string, deadlineDate: string) {
        this.description = description;
        this.status = 0;
        this.deadlineDate = deadlineDate;
    }
}


function localDateFormat(date_string: string) {
    try {
        return new Date(date_string).toLocaleDateString("de-DE");
    } catch (e) {
        return date_string;
    }
}