import { Component, forwardRef, OnInit, Input, OnDestroy } from '@angular/core'
import { NG_VALUE_ACCESSOR } from '@angular/forms'
import {
  Subject,
  Observable,
  takeUntil,
  concat,
  of,
  distinctUntilChanged,
  tap,
  switchMap,
  map,
  catchError,
} from 'rxjs'
import { FILTER_TITLE } from 'src/app/data/filter-rule-type'
import { Document } from 'src/app/data/document'
import { DocumentService } from 'src/app/services/rest/document.service'
import { AbstractInputComponent } from '../abstract-input'
import { CustomFieldsService } from 'src/app/services/rest/custom-fields.service'

@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextSelectComponent),
      multi: true,
    },
  ],
  selector: 'pngx-input-text-select',
  templateUrl: './text-select.component.html',
  styleUrls: ['./text-select.component.scss'],
})
export class TextSelectComponent
  extends AbstractInputComponent<any[]>
  implements OnInit, OnDestroy {

  textSelectInput = new Subject<string>()
  foundTextInputs$: Observable<string[]>
  loading = false
  selectedTextSelectInput: string[] = []

  private unsubscribeNotifier: Subject<any> = new Subject()

  @Input()
  notFoundText: string = $localize`Not found`

  @Input()
  parentDocumentID: number

  @Input()
  field: number


  constructor(private documentsService: DocumentService, private customFieldService: CustomFieldsService) {
    super()
  }

  ngOnInit() {
    this.loadDocs()
  }

  writeValue(documentIDs: string[]): void {
    this.selectedTextSelectInput = documentIDs
    super.writeValue(documentIDs)
    // if (!documentIDs || documentIDs.length === 0) {
    //   this.selectedTextSelectInput = []
    //   super.writeValue([])
    // } else {
    //   this.loading = true
    //   this.documentsService
    //     .getFew(documentIDs, { fields: 'id,title' })
    //     .pipe(takeUntil(this.unsubscribeNotifier))
    //     .subscribe((documentResults) => {
    //       this.loading = false
    //       this.selectedTextSelectInput = documentIDs.map((id) =>
    //         documentResults.results.find((d) => d.id === id)
    //       )
    //       super.writeValue(documentIDs)
    //     })
    // }
  }

  private loadDocs() {
    this.foundTextInputs$ = concat(
      of([]), // default items
      this.textSelectInput.pipe(
        distinctUntilChanged(),
        takeUntil(this.unsubscribeNotifier),
        tap(() => (this.loading = true)),
        switchMap((title) =>
          this.customFieldService.getCustomFieldValues(this.field)
            .pipe(
              map((results) =>
                results.results.filter(s => s !== title)
              ),
              catchError(() => of([])), // empty on error
              tap(() => (this.loading = false))
            )
        )
      )
    )
  }

  unselect(textSelectString: string): void {
    // this.selectedTextSelectInput = this.selectedTextSelectInput.filter(
    //   (d) => d.id !== document.id
    // )
    // this.onChange(this.selectedTextSelectInput.map((d) => d.id))
  }

  addItem = (term) => term;

  compareDocuments(textSelectInput: string, selectetextSelectInput: string) {
    return textSelectInput === selectetextSelectInput
  }

  trackByFn(item: string) {
    return item
  }

  ngOnDestroy(): void {
    this.unsubscribeNotifier.next(true)
    this.unsubscribeNotifier.complete()
  }
}
