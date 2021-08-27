import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { NavController, PopoverController } from '@ionic/angular';
import { Pet } from 'src/app/classes/pet';
import { InfoErrorModalService } from 'src/app/services/infoErrorModal.service';
import { DataService } from 'src/app/services/data.service';
import { TrackingService } from '../../../../services/tracking.service';

@Component({
  selector: 'app-pet-switcher',
  templateUrl: './pet-switcher.component.html',
  styleUrls: ['./pet-switcher.component.scss'],
})
export class PetSwitcherComponent {
  @Input() currentPetName: string;
  @Input() pets: Pet[];

  public defaultImage = "../../../assets/default_dog_profile.png"
  public petImage;

  constructor(
    private navController:NavController, 
    private popover: PopoverController, 
    private dataService: DataService, 
    private trackingService: TrackingService,
    private infoErrorModal: InfoErrorModalService,
    private cdr: ChangeDetectorRef
  ) {
    this.dataService.currentPet$.subscribe((pet: Pet) => { // subscribe for when current pet changes
      this.petImage = pet.picture ? `${pet.picture}?${+new Date()}` : this.defaultImage
    });
  }

  async switchPet(pet: Pet) {
    this.dataService.setCurrentPet(pet)
    .then(() => {
      this.trackingService.trackMe("Pet Profile Changed")
      this.popover.dismiss()
    })
    .catch(err => this.infoErrorModal.displayModal("error", err))
  }

 async addPet() {
   await this.closeMenu();
    this.navController.navigateRoot(['details'], { queryParams: { multiPet: '1' } })
  }

  async closeMenu() {
    await this.popover.dismiss();
  }
}
