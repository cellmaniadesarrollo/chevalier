import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
@Component({
  selector: 'app-search-autocomplete',
  templateUrl: './search-autocomplete.component.html',
  styleUrl: './search-autocomplete.component.css'
})
export class SearchAutocompleteComponent <T> implements OnInit  {
  @Input() placeholder: string = 'Buscar';
  @Input() label: string = 'Buscar';
  @Input() data: T[] = [];
  @Input() displayWithFn: ((value: T) => string) | null = null;
  @Input() control!: FormControl;
  @Output() optionSelected = new EventEmitter<T>();

  filteredData$: Observable<T[]> = of([]);

  ngOnInit(): void {
    // Validar que el control sea un FormControl
    if (!this.control || !(this.control instanceof FormControl)) {
      throw new Error('El control debe ser una instancia de FormControl.');
    }

    this.filteredData$ = this.control.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : this.displayWith(value))),
      map((text) => this.filterData(text))
    );
  }

  private filterData(query: string): T[] {
    const filterValue = query.toLowerCase().trim();
    return filterValue
      ? this.data.filter((item) =>
          this.displayWith(item).toLowerCase().includes(filterValue)
        )
      : this.data;
  }

  get displayWith(): (value: T) => string {
    return this.displayWithFn || ((value: any) => (value ? value.toString() : ''));
  }

  onOptionSelected(event: any): void {
    this.optionSelected.emit(event.option.value);
  }

  onFocus(): void {
    if (!this.control.value) {
      this.control.setValue('');
    }
  }
}
