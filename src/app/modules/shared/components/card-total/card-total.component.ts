import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-total',
  templateUrl: './card-total.component.html',
  styleUrls: ['./card-total.component.scss'],
})
export class CardTotalComponent implements OnInit {
  @Input() subtitle: string = '';
  @Input() title: string = '';
  constructor() {}

  ngOnInit(): void {}
}
