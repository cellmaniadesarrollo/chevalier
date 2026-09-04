import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserManagementService } from '../../service/user-management/user-management.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-create-modal',
  templateUrl: './user-create-modal.component.html',
  styleUrl: './user-create-modal.component.css'
})
export class UserCreateModalComponent {
  form: FormGroup;
  roles: any[] = [];
  isLoadingRoles = false;
  isSaving = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userManagementService: UserManagementService,
    private dialogRef: MatDialogRef<UserCreateModalComponent>
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roles: [[], Validators.required],
      personalData: this.fb.group({
        dni: ['', Validators.required],
        firstnames: ['', Validators.required],
        firstnames1: [''],
        lastnames: ['', Validators.required],
        lastnames1: [''],
        phone: [''],
        date_of_admission: ['', Validators.required],
        dateOfBirth: [''],
      }),
    });
  }

  async ngOnInit(): Promise<void> {
    this.isLoadingRoles = true;
    try {
      const initialData = await this.userManagementService.getInitialData();
      this.roles = initialData.roles;
    } catch (error) {
      console.error('Error cargando roles:', error);
    } finally {
      this.isLoadingRoles = false;
    }
  }

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = null;

    try {
      const createdUser = await this.userManagementService.create(this.form.value);
      this.dialogRef.close(createdUser);
    } catch (error: any) {
      this.errorMessage = error?.response?.data?.message || 'Ocurrió un error al crear el usuario.';
    } finally {
      this.isSaving = false;
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
