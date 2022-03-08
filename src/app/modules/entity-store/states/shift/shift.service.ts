import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { Shift } from 'src/app/modules/shared/models/shift.model';

@Injectable({ providedIn: 'root' })
export class ShiftService extends EntityCollectionServiceBase<Shift> {
  constructor(elementsFactory: EntityCollectionServiceElementsFactory) {
    super('Shift', elementsFactory);
  }
}
