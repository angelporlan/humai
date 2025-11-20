import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../services/settings.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  name: string = '';
  bio: string = '';
  avatar: string = '';

  isPrivate: boolean = false;
  allowCommentsFrom: string = 'everyone';

  emailNotifications: boolean = true;
  pushNotifications: boolean = true;

  currentPassword: string = '';
  newPassword: string = '';
  newPasswordConfirmation: string = '';

  deletePassword: string = '';

  loading: boolean = true;
  activeSection: string = 'account';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private settingsService: SettingsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings() {
    this.loading = true;
    this.settingsService.getSettings().subscribe(
      (response: any) => {
        this.name = response.profile.name || '';
        this.bio = response.profile.bio || '';
        this.avatar = response.profile.avatar || '';
        this.isPrivate = response.privacy.is_private;
        this.allowCommentsFrom = response.privacy.allow_comments_from;
        this.emailNotifications = response.notifications.email_notifications;
        this.pushNotifications = response.notifications.push_notifications;
        this.loading = false;
      },
      (error) => {
        console.error('Error loading settings:', error);
        this.errorMessage = 'Error al cargar la configuración';
        this.loading = false;
      }
    );
  }

  setActiveSection(section: string) {
    this.activeSection = section;
    this.successMessage = '';
    this.errorMessage = '';
  }

  updateProfile() {
    this.settingsService.updateProfile({
      name: this.name,
      bio: this.bio,
      avatar: this.avatar
    }).subscribe(
      (response) => {
        this.successMessage = 'Perfil actualizado correctamente';
        this.errorMessage = '';
      },
      (error) => {
        this.errorMessage = 'Error al actualizar el perfil';
        this.successMessage = '';
      }
    );
  }

  updatePrivacy() {
    this.settingsService.updatePrivacySettings({
      is_private: this.isPrivate,
      allow_comments_from: this.allowCommentsFrom
    }).subscribe(
      (response) => {
        this.successMessage = 'Configuración de privacidad actualizada';
        this.errorMessage = '';
      },
      (error) => {
        this.errorMessage = 'Error al actualizar la privacidad';
        this.successMessage = '';
      }
    );
  }

  updateNotifications() {
    this.settingsService.updateNotificationSettings({
      email_notifications: this.emailNotifications,
      push_notifications: this.pushNotifications
    }).subscribe(
      (response) => {
        this.successMessage = 'Configuración de notificaciones actualizada';
        this.errorMessage = '';
      },
      (error) => {
        this.errorMessage = 'Error al actualizar las notificaciones';
        this.successMessage = '';
      }
    );
  }

  changePassword() {
    if (this.newPassword !== this.newPasswordConfirmation) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.settingsService.changePassword({
      current_password: this.currentPassword,
      new_password: this.newPassword,
      new_password_confirmation: this.newPasswordConfirmation
    }).subscribe(
      (response) => {
        this.successMessage = 'Contraseña cambiada correctamente. Redirigiendo...';
        this.errorMessage = '';
        setTimeout(() => {
          localStorage.removeItem('humai');
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      (error) => {
        this.errorMessage = error.error.message || 'Error al cambiar la contraseña';
        this.successMessage = '';
      }
    );
  }

  deleteAccount() {
    if (!confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      return;
    }

    this.settingsService.deleteAccount(this.deletePassword).subscribe(
      (response) => {
        this.successMessage = 'Cuenta eliminada correctamente. Redirigiendo...';
        setTimeout(() => {
          localStorage.removeItem('humai');
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      (error) => {
        this.errorMessage = error.error.message || 'Error al eliminar la cuenta';
        this.successMessage = '';
      }
    );
  }
}
