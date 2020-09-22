export interface iNotificationReference {
  code:number;
  priority:number;
  message:string;
  duration:number;
}

export interface iNotification extends iNotificationReference {
  readonly id:string;
}
