import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms'
import { NgSelectModule } from '@ng-select/ng-select'
import { of, throwError } from 'rxjs'
import { DocumentService } from 'src/app/services/rest/document.service'
import { TextSelectComponent } from './text-select.component'
import { FILTER_TITLE } from 'src/app/data/filter-rule-type'

const documents = [
  {
    id: 1,
    title: 'Document 1 foo',
  },
  {
    id: 12,
    title: 'Document 12 bar',
  },
  {
    id: 16,
    title: 'Document 16 bar',
  },
  {
    id: 23,
    title: 'Document 23 bar',
  },
]

describe('TextSelectComponent', () => {
  let component: TextSelectComponent
  let fixture: ComponentFixture<TextSelectComponent>
  let documentService: DocumentService

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextSelectComponent],
      imports: [
        HttpClientTestingModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    })
    documentService = TestBed.inject(DocumentService)
    fixture = TestBed.createComponent(TextSelectComponent)
    fixture.debugElement.injector.get(NG_VALUE_ACCESSOR)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should retrieve selected documents from API', () => {
    const getSpy = jest.spyOn(documentService, 'getFew')
    getSpy.mockImplementation((ids) => {
      const docs = documents.filter((d) => ids.includes(d.id))
      return of({
        count: docs.length,
        all: docs.map((d) => d.id),
        results: docs,
      })
    })
    component.writeValue(['1'])
    expect(getSpy).toHaveBeenCalled()
  })

  it('shoud maintain ordering of selected documents', () => {
    const getSpy = jest.spyOn(documentService, 'getFew')
    getSpy.mockImplementation((ids) => {
      const docs = documents.filter((d) => ids.includes(d.id))
      return of({
        count: docs.length,
        all: docs.map((d) => d.id),
        results: docs,
      })
    })
    component.writeValue(['12', '1'])
    expect(component.selectedTextSelectInput).toEqual([documents[1], documents[0]])
  })

  it('should search API on select text input', () => {
    const listSpy = jest.spyOn(documentService, 'listFiltered')
    listSpy.mockImplementation(
      (page, pageSize, sortField, sortReverse, filterRules, extraParams) => {
        const docs = documents.filter((d) =>
          d.title.includes(filterRules[0].value)
        )
        return of({
          count: docs.length,
          results: docs,
          all: docs.map((d) => d.id),
        })
      }
    )
    component.textSelectInput.next('bar')
    expect(listSpy).toHaveBeenCalledWith(
      1,
      null,
      'created',
      true,
      [{ rule_type: FILTER_TITLE, value: 'bar' }],
      { truncate_content: true }
    )
    listSpy.mockReturnValueOnce(throwError(() => new Error()))
    component.textSelectInput.next('foo')
  })

  it('should load values correctly', () => {
    const getSpy = jest.spyOn(documentService, 'getFew')
    getSpy.mockImplementation((ids) => {
      const docs = documents.filter((d) => ids.includes(d.id))
      return of({
        count: docs.length,
        all: docs.map((d) => d.id),
        results: docs,
      })
    })
    component.writeValue(['12', '23'])
    expect(component.value).toEqual(['12', '23'])
    expect(component.selectedTextSelectInput).toEqual([documents[1], documents[3]])
    component.writeValue(null)
    expect(component.value).toEqual([])
    expect(component.selectedTextSelectInput).toEqual([])
    component.writeValue([])
    expect(component.value).toEqual([])
    expect(component.selectedTextSelectInput).toEqual([])
  })

  it('should support unselect', () => {
    const getSpy = jest.spyOn(documentService, 'getFew')
    getSpy.mockImplementation((ids) => {
      const docs = documents.filter((d) => ids.includes(d.id))
      return of({
        count: docs.length,
        all: docs.map((d) => d.id),
        results: docs,
      })
    })
    component.writeValue(['12', '23'])
    component.unselect('text')
    fixture.detectChanges()
    expect(component.selectedTextSelectInput).toEqual([documents[1]])
  })

  it('should use correct compare, trackBy functions', () => {
    expect(component.compareDocuments(documents[0], { id: 1 })).toBeTruthy()
    expect(component.compareDocuments(documents[0], { id: 2 })).toBeFalsy()
    expect(component.trackByFn('test')).toEqual(12)
  })

  it('should not include the current document or already selected documents in results', () => {
    let foundDocs
    component.foundTextInputs$.subscribe((found) => (foundDocs = found))
    component.parentDocumentID = 23
    component.selectedTextSelectInput = ['text']
    const listSpy = jest.spyOn(documentService, 'listFiltered')
    listSpy.mockImplementation(
      (page, pageSize, sortField, sortReverse, filterRules, extraParams) => {
        const docs = documents.filter((d) =>
          d.title.includes(filterRules[0].value)
        )
        return of({
          count: docs.length,
          results: docs,
          all: docs.map((d) => d.id),
        })
      }
    )
    component.textSelectInput.next('bar')
    expect(foundDocs).toEqual([documents[1]])
  })
})
