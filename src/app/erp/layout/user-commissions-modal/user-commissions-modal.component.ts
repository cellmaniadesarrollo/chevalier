import { Component, Inject } from '@angular/core';
import { UserManagementService } from '../../service/user-management/user-management.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-commissions-modal',
  templateUrl: './user-commissions-modal.component.html',
  styleUrl: './user-commissions-modal.component.css'
})
export class UserCommissionsModalComponent {
  user: any;
  commissions: any[] = [];
  services: any[] = [];

  isLoading = false;
  isSaving = false;
  errorMessage: string | null = null;

  // formulario para agregar una comisión nueva
  newCommission: { service: string; servicePrice: number | null; rate: number | null } = {
    service: '',
    servicePrice: null,
    rate: null,
  };

  // fila que se está editando
  editingId: string | null = null;
  editValues: { servicePrice: number | null; rate: number | null } = { servicePrice: null, rate: null };

  constructor(
    private userManagementService: UserManagementService,
    private dialogRef: MatDialogRef<UserCommissionsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: any }
  ) {
    this.user = data.user;
  }

  async ngOnInit(): Promise<void> {
    await this.loadAll();
  }

  async loadAll(): Promise<void> {
    this.isLoading = true;
    try {
      const [commissions, services] = await Promise.all([
        this.userManagementService.listCommissionsByUser(this.user._id),
        this.userManagementService.listServicesSimple(),
      ]);
      this.commissions = commissions;
      this.services = services;
    } catch (error) {
      console.error('Error cargando comisiones:', error);
    } finally {
      this.isLoading = false;
    }
  }

  get selectedNewService(): any {
    return this.services.find((s) => s._id === this.newCommission.service) || null;
  }

  onServiceChange(): void {
    this.newCommission.servicePrice = null;
  }

  async addCommission(): Promise<void> {
    if (!this.newCommission.service || this.newCommission.rate === null || this.newCommission.rate === undefined) {
      return;
    }

    this.isSaving = true;
    this.errorMessage = null;

    try {
      await this.userManagementService.createCommission({
        user: this.user._id,
        service: this.newCommission.service,
        servicePrice: this.newCommission.servicePrice,
        rate: this.newCommission.rate,
      });

      this.newCommission = { service: '', servicePrice: null, rate: null };
      await this.loadAll();
    } catch (error: any) {
      this.errorMessage = error?.response?.data?.message || 'No se pudo agregar la comisión.';
    } finally {
      this.isSaving = false;
    }
  }

  startEdit(commission: any): void {
    this.editingId = commission._id;
    this.editValues = {
      servicePrice: commission.servicePrice,
      rate: commission.rate,
    };
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  async saveEdit(commission: any): Promise<void> {
    this.isSaving = true;
    this.errorMessage = null;

    try {
      await this.userManagementService.updateCommission(commission._id, {
        servicePrice: this.editValues.servicePrice,
        rate: this.editValues.rate || 0,
      });
      this.editingId = null;
      await this.loadAll();
    } catch (error: any) {
      this.errorMessage = error?.response?.data?.message || 'No se pudo editar la comisión.';
    } finally {
      this.isSaving = false;
    }
  }

  async removeCommission(commission: any): Promise<void> {
    if (!confirm('¿Eliminar esta comisión?')) return;

    try {
      await this.userManagementService.removeCommission(commission._id);
      await this.loadAll();
    } catch (error) {
      console.error('Error eliminando comisión:', error);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
