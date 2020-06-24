import {
  IsDefined,
  IsEthereumAddress,
  IsNotEmpty,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';

class ValidationData {
  @IsString()
  @Matches(/(crypto)$/)
  domainName: string;

  @IsEthereumAddress()
  domainOwner: string;

  @IsString()
  @IsNotEmpty()
  validationCode: string;

  @IsString()
  @IsNotEmpty()
  twitterUsernameKey: string;

  @IsString()
  @IsNotEmpty()
  validatorSignatureKey: string;
}

export default class TwitterValidationRequest {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsDefined()
  @ValidateNested()
  data: ValidationData;
}
