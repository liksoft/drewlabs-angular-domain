import { Injectable } from '@angular/core';
import {
  postRessource,
} from 'src/app/lib/domain/contracts/abstract-request-client';
import { HttpRequestService } from 'src/app/lib/domain/http/core';
import { ISerializableBuilder } from 'src/app/lib/domain/built-value/contracts/serializers';
import { TranslationService } from 'src/app/lib/domain/translator/translator.service';
import { DrewlabsRessourceAssignment } from './ressource-assignment';

@Injectable()
export class DrewlabsRessourceAssignmentService {

  public readonly assignationRessoucesPath = 'ressources/ressource_assignations';

  /**
   * @description Service initializer
   */
  constructor(
    private client: HttpRequestService,
    private translate: TranslationService
  ) {
  }

  /**
   * @description Returns a list of translation that can be use on the Immatriculation component and it children
   */
  loadTranslations(ressourceId?: string|number, username?: string, count?: number): Promise<any> {
    return this.translate.translate([
      'invalidRequestParams',
      'serverRequestFailed',
      'successfulRequest',
      'validationPrompt',
      'rejectionPrompt',
      'successfulValidation',
      'successfulRejection',
      'assignmentPrompt',
      'successfullAssignment',
      'batchAssignmentPrompt'
    ], {name: `Demande No ${ressourceId}`, username, count}).toPromise();
  }

  public createAssignment(requestURL: string, requestBody: object|object[]) {
    return postRessource<DrewlabsRessourceAssignment>(
      this.client,
      `${requestURL}`,
      requestBody,
      DrewlabsRessourceAssignment.builder() as ISerializableBuilder<DrewlabsRessourceAssignment>
    );
  }
}
