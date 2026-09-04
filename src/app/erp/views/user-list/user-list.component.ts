import { Component } from '@angular/core';
import { UserManagementService } from '../../service/user-management/user-management.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { UserEditModalComponent } from '../../layout/user-edit-modal/user-edit-modal.component';
import { UserCreateModalComponent } from '../../layout/user-create-modal/user-create-modal.component';
import { UserCommissionsModalComponent } from '../../layout/user-commissions-modal/user-commissions-modal.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  displayedColumns: string[] = ['username', 'fullName', 'dni', 'roles', 'status', 'actions'];

  users: any[] = [];
  totalUsers = 0;
  isLoading = false;

  page = 1;
  limit = 10;
  search = '';
  status: 'active' | 'deleted' | 'all' = 'active';

  private searchSubject = new Subject<string>();

  constructor(private userManagementService: UserManagementService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe((value) => {
      this.search = value;
      this.page = 1;
      this.loadUsers();
    });

    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  async loadUsers(): Promise<void> {
    this.isLoading = true;
    try {
      const result = await this.userManagementService.list({
        page: this.page,
        limit: this.limit,
        search: this.search,
        status: this.status,
      });

      this.users = result.docs;
      this.totalUsers = result.totalDocs;
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    } finally {
      this.isLoading = false;
    }
  }

  onSearchInput(value: string): void {
    this.searchSubject.next(value);
  }

  onStatusChange(value: 'active' | 'deleted' | 'all'): void {
    this.status = value;
    this.page = 1;
    this.loadUsers();
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.loadUsers();
  }

  fullName(user: any): string {
    const pd = user.personalData;
    if (!pd) return '-';
    return [pd.firstnames, pd.firstnames1, pd.lastnames, pd.lastnames1]
      .filter(Boolean)
      .join(' ');
  }

  roleNames(user: any): string {
    return (user.roles || []).map((r: any) => r.name).join(', ');
  }

  async softDelete(user: any): Promise<void> {
    if (!confirm(`¿Desactivar al usuario "${user.username}"?`)) return;
    try {
      await this.userManagementService.softDelete(user._id);
      this.loadUsers();
    } catch (error) {
      console.error('Error desactivando usuario:', error);
    }
  }

  async restore(user: any): Promise<void> {
    if (!confirm(`¿Reactivar al usuario "${user.username}"?`)) return;
    try {
      await this.userManagementService.restore(user._id);
      this.loadUsers();
    } catch (error) {
      console.error('Error reactivando usuario:', error);
    }
  }

  // Enlázalo a tu ruta de edición, o abre un modal de Angular Material
  edit(user: any): void {
    const dialogRef = this.dialog.open(UserEditModalComponent, {
      width: '600px',
      data: { user },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers(); // refresca la tabla si se guardó
      }
    });
  }
  openCreateModal(): void {
    const dialogRef = this.dialog.open(UserCreateModalComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.page = 1;
        this.loadUsers();
      }
    });
  }
  openCommissionsModal(user: any): void {
    this.dialog.open(UserCommissionsModalComponent, {
      width: '700px',
      data: { user },
    });
  }
}
