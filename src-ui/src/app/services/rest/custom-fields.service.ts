import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { AbstractPaperlessService } from './abstract-paperless-service'
import { CustomField } from 'src/app/data/custom-field'
import { Observable } from 'rxjs'
import { Results } from 'src/app/data/results'

@Injectable({
  providedIn: 'root',
})
export class CustomFieldsService extends AbstractPaperlessService<CustomField> {
  constructor(http: HttpClient) {
    super(http, 'custom_fields')
  }

  getCustomFieldValues(field: Number, query: String): Observable<Results<string>> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('field', field.toString())
    httpParams = httpParams.set('query', query.toString())

    return this.http.get<Results<string>>(this.getResourceUrl(null, 'customfield_values'), {
      params: httpParams,
    })

  }
}
