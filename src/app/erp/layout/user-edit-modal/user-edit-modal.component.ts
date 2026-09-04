import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserManagementService } from '../../service/user-management/user-management.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-edit-modal',
  templateUrl: './user-edit-modal.component.html',
  styleUrl: './user-edit-modal.component.css'
})
export class UserEditModalComponent {
  form: FormGroup;
  roles: any[] = [];
  isLoadingRoles = false;
  isSaving = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userManagementService: UserManagementService,
    private dialogRef: MatDialogRef<UserEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: any }
  ) {
    const user = data.user;
    const pd = user.personalData || {};

    this.form = this.fb.group({
      username: [user.username, Validators.required],
      email: [user.email || ''],
      roles: [(user.roles || []).map((r: any) => r._id), Validators.required],
      password: [''], // opcional, solo si se quiere cambiar
      personalData: this.fb.group({
        dni: [pd.dni || '', Validators.required],
        firstnames: [pd.firstnames || '', Validators.required],
        firstnames1: [pd.firstnames1 || ''],
        lastnames: [pd.lastnames || '', Validators.required],
        lastnames1: [pd.lastnames1 || ''],
        phone: [pd.phone || ''],
        dateOfBirth: [this.toDateInputValue(pd.dateOfBirth)],
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

  private toDateInputValue(date: any): string {
    if (!date) return '';
    return new Date(date).toISOString().substring(0, 10);
  }

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = null;

    const value = this.form.value;
    const payload: any = {
      username: value.username,
      email: value.email,
      roles: value.roles,
      personalData: value.personalData,
    };

    if (value.password && value.password.trim()) {
      payload.password = value.password.trim();
    }

    try {
      const updatedUser = await this.userManagementService.update(this.data.user._id, payload);
      this.dialogRef.close(updatedUser);
    } catch (error: any) {
      this.errorMessage = error?.response?.data?.message || 'Ocurrió un error al guardar los cambios.';
    } finally {
      this.isSaving = false;
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
