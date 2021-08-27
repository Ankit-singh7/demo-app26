import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'petPhoto'
})
export class PetPhotoPipe implements PipeTransform {
  public defaultImage = "url(../../../assets/default_dog_profile.png)"

  transform(pet): unknown {
    return pet?.picture ? `url(${pet.picture}?${+new Date()})` : this.defaultImage
  }

}
