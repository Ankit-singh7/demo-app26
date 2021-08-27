import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastController: ToastController) {}
  public async showToast(message) {
    const toast = await this.toastController.create({ message, duration: 3000 })
    toast.present()
  }
}