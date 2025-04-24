import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AsyncPipe, JsonPipe, NgForOf, NgIf} from '@angular/common';
import {map, Observable, of, tap} from 'rxjs';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  DragDropModule,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';

interface Todo {
  id: number;
  title: string;
  description: string;
  status: string;
  done?: any;
  pending?: any;
  backlog?: any;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    AsyncPipe,
    NgIf,
    CdkDropList,
    CdkDrag,
    DragDropModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  form!: FormGroup;
  $todoList: Observable<any> = new Observable();

  constructor(private fb: FormBuilder, private http: HttpClient) {
  }

  ngOnInit(): void {
    this.initForm();
    this.getAllTodos();
  }

  drop(event: CdkDragDrop<Todo[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const movedTodo = event.previousContainer.data[event.previousIndex];
      const newStatus = this.getStatusFromContainerId(event.container.id);

      const updatedTodo = { ...movedTodo, status: newStatus };

      this.http.put<Todo>(`http://localhost:8080/todo/${updatedTodo.id}`, updatedTodo).subscribe({
        next: () => {
          // После успешного обновления на сервере — переносим в UI
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex,
          );
        },
        error: err => {
          console.error('Ошибка обновления задачи:', err);
        }
      });
    }
  }

  getStatusFromContainerId(containerId: string): string {
    return containerId;
  }

  getAllTodos() {
    this.$todoList = this.http.get<Todo[]>('http://localhost:8080/todo').pipe(
      tap(groupedTodos => console.log('Группированные по статусу:', groupedTodos))
    );
  }


  initForm(): void {
    this.form = this.fb.group({
      title: ['test_title', [Validators.required]],
      description: ['test_description', [Validators.required]],
      status: ['backlog', [Validators.required]],
    })
  }

  submit() {
    this.http.post<Todo[]>('http://localhost:8080/todo', this.form.value).subscribe(updatedList => {
      this.$todoList = of(updatedList);
    });
  }

  delete(id: number): void {
    this.http.delete<Todo[]>(`http://localhost:8080/todo/${id}`).subscribe(updatedList => {
      this.$todoList = of(updatedList);
    });
  }
}
