import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-update',
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
  ],
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss'
})
export class UpdateComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      title: ['test_title', [Validators.required]],
      description: ['test_description', [Validators.required]],
      status: ['backlog', [Validators.required]],
    })
  }

  submit() {
    this.http.post('http://localhost:8080/todo', this.form.value).subscribe(res => {})
  }
}
