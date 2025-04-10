import { RegisterDto } from '@auth/dto';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsPasswordMatching', async: false })
export class IsPasswordMatchingConstraint
  implements ValidatorConstraintInterface
{
  validate(passwordRepeat: string, args: ValidationArguments) {
    const obj = args.object as RegisterDto;
    return obj.passwordHash === passwordRepeat;
  }

  defaultMessage(): string {
    return 'Пароли не совпадают';
  }
}
