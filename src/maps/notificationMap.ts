import type { iNotificationReference } from '../interfaces/iNotification';

export const notificationMap:{[key:string]:iNotificationReference} = {
  ankiConnecting: {
    code: 0,
    priority: 1,
    message: 'Trying to connect to Anki',
    duration: 0
  },
  ankiNotConnected: {
    code: 1,
    priority: 0,
    message: 'No connection to Anki',
    duration: 0
  },
  ankiConnected: {
    code: 2,
    priority: 2,
    message: 'Connected to Anki',
    duration: 4
  },
  invalidCardTagCharacter: {
    code: 3,
    priority: 1,
    message: '',
    duration: 6
  }
};
