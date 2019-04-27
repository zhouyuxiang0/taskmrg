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
  // transition('* => *', [
  //   query(':enter', [
  //     style({ opacity: 0 }),
  //     stagger(100, [animate('1s', style({ opacity: 1 }))])
  //   ], { optional: true }),
  //   query(':leave', [
  //     style({ opacity: 1 }),
  //     stagger(100, [animate('1s', style({ opacity: 0 }))])
  //   ], { optional: true }),
  // ])
  transition('* => *', [
    query(':leave', [
      stagger(100, [
        animate('5s', style({ opacity: 0 }))
      ])
    ], { optional: true }),
    query(':enter', [
      style({ opacity: 0 }),
      stagger(100, [
        animate('5s', style({ opacity: 1 }))
      ])
    ], { optional: true })
  ])
]);
