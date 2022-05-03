import { ValueTransformer } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
// import { SERVER_URL, UPLOADS_DIR } from '../../constants';
import moment from 'moment';

export class UUIDTransformer implements ValueTransformer {
  public to(value: any): string {
    if (value) {
      return value;
    }
    return uuidv4();
  }

  public from(value: string | null): string | null {
    return value;
  }
}

// export class FileTransformer implements ValueTransformer {
//   public to(value: string): string {
//     return value;
//   }

//   public from(value: string | null): string | null {
//     if (value) {
//       return `${SERVER_URL}/${UPLOADS_DIR}/${value}`;
//     } else {
//       return null;
//     }
//   }
// }

export class DateTimeTransformer implements ValueTransformer {
  public to(value: string): string {
    return value;
  }

  public from(value: string | number | null): string | null {
    if (value) {
      //IMPORTANT : WE NEED TO USE utcOffset TO IGNORE TIME-ZONE
      return moment(value).utcOffset(0, true).format();
    } else {
      return null;
    }
  }
}
