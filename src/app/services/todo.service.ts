import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/compat/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface Todo {
  id?: string;
  task: string;
  priority: number;
  createdAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  
  // Store todos of type Todo in a database collection. Todos are observables.
  // SnapshotChanges() represent the state of the router at a moment in time.
  // Pipe - map function used to extract the id and return a spread array.
  private todosCollection: AngularFirestoreCollection<Todo>;
  private todos: Observable<Todo[]>;

  constructor(db: AngularFirestore) {
    this.todosCollection = db.collection<Todo>("todos", ref => ref.orderBy("priority"));

    this.todos = this.todosCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((todo) => {
          //loops through todos and returns item with id
          return { id: todo.payload.doc.id, ...todo.payload.doc.data() };
        });
      })
    );
  }

    // Return observable array of todos
    getTodos(): Observable<Todo[]> {
      return this.todos;
    }
    // Return a todo from database collection by id to view
    getTodo(id: string): Observable<Todo> {
      return this.todosCollection.doc<Todo>(id).valueChanges();
    }
    // Return updated todo, using inputs of updated todo and id
    updateTodo(todo: Todo, id: string): Promise<any> {
      return this.todosCollection.doc(id).update(todo);
    }
    // Add a todo (using add not push)
    addTodo(todo: Todo): Promise<any> {
      return this.todosCollection.add(todo);
    }
    // Delete a todo by id
    removeTodo(id: string): Promise<any> {
      return this.todosCollection.doc(id).delete();
    }
}
