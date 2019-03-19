import {
  animate,
  keyframes,
  query,
  stagger,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';


export const listAnimation = trigger('listAnim', [
  transition('* => *', [
    query(':enter', style({ opacity: 0 })),
    query(':enter', stagger(100, [
      animate('1s', style({ opacity: 1 }))
    ])),
    query(':leave', style({ opacity: 1 })),
    query(':leave', stagger(100, [
      animate('1s', style({ opacity: 0 }))
    ]))
  ]),
]);
