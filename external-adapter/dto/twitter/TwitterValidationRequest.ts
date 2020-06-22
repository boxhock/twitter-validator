import {
  IsEthereumAddress,
  IsFQDN,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

class ValidationData {
  @IsFQDN({ require_tld: false, allow_underscores: true })
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

  @ValidateNested()
  data: ValidationData;
}
