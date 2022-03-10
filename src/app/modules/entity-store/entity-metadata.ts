import { EntityDataModuleConfig, EntityMetadataMap } from '@ngrx/data';

const entityMetadata: EntityMetadataMap = {
  Employee: {
    entityDispatcherOptions: { optimisticAdd: true, optimisticUpdate: true }
  },
  Shift: {
    entityDispatcherOptions: { optimisticAdd: true, optimisticUpdate: true }
  }
};

export const entityConfig: EntityDataModuleConfig = {
  entityMetadata
}